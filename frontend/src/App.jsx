import { useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import HeroVisual from './components/HeroVisual';
import FeatureGrid from './components/FeatureGrid';
import Footer from './components/Footer';

const sampleResumeData = {
  score: 86,
  matched: [
    'React',
    'TypeScript',
    'Node.js',
    'SQL',
    'Figma',
    'Product Thinking',
    'UX Strategy',
    'JavaScript',
    'API Design',
    'Agile',
    'Testing',
    'Communication'
  ],
  missing: ['Python', 'AWS', 'Leadership', 'CI/CD']
};

function truncateFileName(fileName) {
  return fileName.length > 24 ? `${fileName.slice(0, 20)}...` : fileName;
}

export default function App() {
  const inputRef = useRef(null);
  const jdRef = useRef(null);
  const [fileLabel, setFileLabel] = useState('Drop your PDF here');
  const [jdLabel, setJdLabel] = useState('No JD uploaded');
  const [score, setScore] = useState(86);
  const [matchedSkills, setMatchedSkills] = useState(sampleResumeData.matched);
  const [missingSkills, setMissingSkills] = useState(sampleResumeData.missing);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const matchedCount = matchedSkills.length;
  const missingCount = missingSkills.length;

  const progressStyle = useMemo(
    () => ({
      '--progress': score
    }),
    [score]
  );

  function applyResumeData(file) {
    if (!file) return;

    setFileLabel(truncateFileName(file.name || 'resume.pdf'));
    setScore(sampleResumeData.score);
    setMatchedSkills(sampleResumeData.matched);
    setMissingSkills(sampleResumeData.missing);
  }

  function handleFileChange(event) {
    const [file] = event.target.files;
    applyResumeData(file);
  }

  function applyJdData(file) {
    if (!file) return;
    setJdLabel(truncateFileName(file.name || 'job_description.pdf'));
  }

  function handleJdChange(event) {
    const [file] = event.target.files;
    applyJdData(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);

    const [file] = event.dataTransfer.files;
    applyResumeData(file);
  }

  return (
    <div className="page-shell">
      
      <Header/>
      <main className="hero">
        <section className="hero-copy" id="about">
          <span className="eyebrow">AI-powered resume scoring</span>
          <h1>Turn a resume into a hiring signal in seconds.</h1>
          <p>
            Upload a PDF and get an instant score for the role, a list of matched skills,
            and the gaps to close before shipping your next application.
          </p>

          <div className="cta-row">
            <button className="primary-btn" onClick={() => inputRef.current?.click()}>
              Upload resume
            </button>
            <button className="secondary-btn" type="button">
              View demo
            </button>
          </div>

          <ul className="mini-stats">
            <li>
              <strong>2 min</strong>
              <span>analysis</span>
            </li>
            <li>
              <strong>87%</strong>
              <span>accuracy</span>
            </li>
            <li>
              <strong>12+</strong>
              <span>skills tracked</span>
            </li>
          </ul>
        </section>

        <div className="visual-column">
          <HeroVisual />

          <section className="upload-panel" aria-label="Resume upload and results panel">
          <div className="panel-header">
            <span className="dot green" />
            <span className="dot yellow" />
            <span className="dot red" />
          </div>

          <div
            className={`upload-box ${isDragging ? 'dragover' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileChange}
            />
            <input
              ref={jdRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleJdChange}
            />
            <div className="upload-icon">&#8593;</div>
            <p className="upload-title">{fileLabel}</p>
            <p className="upload-subtitle">
              {fileLabel === 'Drop your PDF here' ? 'or click to browse' : 'Resume parsed successfully'}
            </p>
            <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => jdRef.current?.click()}
              >
                Upload JD
              </button>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{jdLabel}</div>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
              <button
                className="primary-btn"
                onClick={async () => {
                  const resumeFile = inputRef.current?.files?.[0];
                  const jdFile = jdRef.current?.files?.[0];
                  if (!resumeFile) return;
                  setIsAnalyzing(true);
                  try {
                    const fd = new FormData();
                    fd.append('resume', resumeFile);
                    if (jdFile) fd.append('jd', jdFile);

                    const resp = await fetch('http://localhost:4000/api/compare', {
                      method: 'POST',
                      body: fd
                    });
                    const data = await resp.json();
                    if (data?.result) {
                      setScore(data.result.score || 0);
                      setMatchedSkills(data.result.matched || []);
                      setMissingSkills(data.result.missing || []);
                    }
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setIsAnalyzing(false);
                  }
                }}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing…' : 'Analyze'}
              </button>
            </div>
          </div>

          <div className="score-block" id="results">
            <div className="score-topline">
              <span className="label">Resume score</span>
              <span className="score-pill">{score}%</span>
            </div>

            <div className="score-ring-wrap">
              <div className="score-ring" style={progressStyle}>
                <div className="score-inner">
                  <strong>{score}</strong>
                  <span>/100</span>
                </div>
              </div>
              <div className="score-meta">
                <div>
                  <span className="meta-label">Matched</span>
                  <strong>{matchedCount}</strong>
                </div>
                <div>
                  <span className="meta-label">Missing</span>
                  <strong>{missingCount}</strong>
                </div>
              </div>
            </div>
          </div>
          </section>
        </div>
      </main>

      <FeatureGrid />

      <section className="skills-grid" id="skills">
        <article className="skill-card present">
          <div className="card-header">
            <span className="section-tag success">Present</span>
            <span className="count">{matchedCount}</span>
          </div>
          <div className="pill-list">
            {matchedSkills.map((skill) => (
              <span className="pill success" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </article>

        <article className="skill-card missing">
          <div className="card-header">
            <span className="section-tag danger">Missing</span>
            <span className="count">{missingCount}</span>
          </div>
          <div className="pill-list">
            {missingSkills.map((skill) => (
              <span className="pill danger" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </article>
      </section>

      <Footer />
    </div>
  );
}


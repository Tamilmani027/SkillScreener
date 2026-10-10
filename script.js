const resumeInput = document.getElementById('resumeInput');
const triggerUpload = document.getElementById('triggerUpload');
const uploadBox = document.getElementById('uploadBox');

const scoreNumber = document.getElementById('scoreNumber');
const scoreBadge = document.getElementById('scoreBadge');
const matchedCount = document.getElementById('matchedCount');
const missingCount = document.getElementById('missingCount');
const presentTotal = document.getElementById('presentTotal');
const missingTotal = document.getElementById('missingTotal');
const scoreRing = document.querySelector('.score-ring');
const presentSkills = document.getElementById('presentSkills');
const missingSkills = document.getElementById('missingSkills');

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

function renderResumeData({ score, matched, missing }) {
  scoreNumber.textContent = score;
  scoreBadge.textContent = `${score}%`;
  matchedCount.textContent = matched.length;
  missingCount.textContent = missing.length;
  presentTotal.textContent = matched.length;
  missingTotal.textContent = missing.length;

  scoreRing.style.setProperty('--progress', score);

  presentSkills.innerHTML = matched
    .map((skill) => `<span class="pill success">${skill}</span>`)
    .join('');

  missingSkills.innerHTML = missing
    .map((skill) => `<span class="pill danger">${skill}</span>`)
    .join('');
}

function mockParseResume(file) {
  if (!file) return;

  const fileName = file.name || 'resume.pdf';
  const fileLabel = fileName.length > 24 ? `${fileName.slice(0, 20)}...` : fileName;

  uploadBox.innerHTML = `
    <div class="upload-icon">✓</div>
    <p class="upload-title">${fileLabel}</p>
    <p class="upload-subtitle">Resume parsed successfully</p>
  `;

  renderResumeData(sampleResumeData);
}

triggerUpload.addEventListener('click', () => resumeInput.click());

resumeInput.addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (file) {
    mockParseResume(file);
  }
});

['dragenter', 'dragover'].forEach((eventName) => {
  uploadBox.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadBox.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  uploadBox.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadBox.classList.remove('dragover');
  });
});

uploadBox.addEventListener('drop', (event) => {
  const [file] = event.dataTransfer.files;
  if (file) {
    mockParseResume(file);
  }
});

renderResumeData(sampleResumeData);

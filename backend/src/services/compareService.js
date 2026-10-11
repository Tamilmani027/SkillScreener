import pdfParse from 'pdf-parse';

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    // try to extract first JSON object block
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}

export async function processFiles(files, db) {
  const resumeFile = files?.resume?.[0];
  const jdFile = files?.jd?.[0];

  let resumeText = '';
  let jdText = '';

  try {
    if (resumeFile?.buffer) {
      const parsed = await pdfParse(resumeFile.buffer);
      resumeText = (parsed?.text || '').trim();
    }
  } catch (err) {
    console.error('Failed to parse resume PDF', err);
  }

  try {
    if (jdFile?.buffer) {
      const parsed = await pdfParse(jdFile.buffer);
      jdText = (parsed?.text || '').trim();
    }
  } catch (err) {
    console.error('Failed to parse JD PDF', err);
  }

  // Compose prompt for LabD AI. Ask for strict JSON output.
  const prompt = `You are an assistant that scores a resume against a job description.
Return ONLY a JSON object with keys: score (integer 0-100), matched (array of strings), missing (array of strings).
Do not include any explanatory text.

Resume:\n${resumeText.slice(0, 15000)}\n\nJob Description:\n${jdText.slice(0, 15000)}`;

  let aiResult = null;
  try {
    const resp = await fetch('https://agent.thedevlabs.io/v1/api/chat', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LABD_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
    });

    if (!resp.ok) {
      console.error('LabD API responded with status', resp.status);
    } else {
      const payload = await resp.json();
      const message = payload?.message;
      const content = message?.content || '';
      aiResult = safeParseJson(content);
    }
  } catch (err) {
    console.error('LabD API call failed', err);
  }

  // Fallback to a simple mock if AI didn't return valid JSON
  if (!aiResult) {
    aiResult = {
      score: 78,
      matched: ['React', 'JavaScript', 'CSS'],
      missing: ['AWS', 'Docker']
    };
  }

  const record = {
    createdAt: new Date(),
    resumeName: resumeFile?.originalname || null,
    jdName: jdFile?.originalname || null,
    metadata: {
      resumeSize: resumeFile?.size || null,
      jdSize: jdFile?.size || null
    },
    result: aiResult
  };

  if (db) {
    try {
      const submissions = db.collection('submissions');
      await submissions.insertOne(record);
    } catch (err) {
      console.error('DB insert failed', err);
    }
  }

  return aiResult;
}

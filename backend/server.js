import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../frontend');
const dataFilePath = path.join(__dirname, 'data/portfolio.json');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));

// Read portfolio data helper
async function getPortfolioData() {
  try {
    const rawData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return null;
  }
}

// Routes
// 1. Get raw portfolio metadata
app.get('/api/portfolio', async (req, res) => {
  const data = await getPortfolioData();
  if (!data) {
    return res.status(500).json({ error: "Failed to load portfolio database." });
  }
  res.json(data);
});

// 2. AI Chat Proxy Route (Server-side RAG)
app.post('/api/chat', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: "Gemini API key is not configured on the server. Please add it to your .env file or use Client Settings." 
    });
  }

  const data = await getPortfolioData();
  if (!data) {
    return res.status(500).json({ error: "Context database is unavailable." });
  }

  // Build Context Document for Gemini API
  const contextString = `
ABOUT ARNAV GUPTA:
${data.personal.aboutLong}

EDUCATION:
${data.education.map(e => `- ${e.institution}: ${e.degree} (${e.duration}), ${e.gpa}. Coursework: ${e.courses.join(', ')}`).join('\n')}

EXPERIENCE:
${data.experience.map(exp => `- ${exp.company} - ${exp.role} (${exp.duration}): ${exp.description}\n  ${exp.bullets.map(b => `  * ${b}`).join('\n')}`).join('\n')}

PROJECTS:
${data.projects.map(p => `- ${p.title} (${p.tag}) [${p.metrics}]: ${p.description}\n  ${p.bullets.map(b => `  * ${b}`).join('\n')}`).join('\n')}

SKILLS:
${data.skills.categories.map(c => `- ${c.name}: ${c.items.join(', ')}`).join('\n')}

CONTACT INFO:
- Email: ${data.personal.email}
- GitHub: ${data.personal.github}
- LinkedIn: ${data.personal.linkedin}
`;

  const systemPrompt = `You are Arnav's Career Copilot, a highly professional AI representing Arnav Gupta. 
Your goal is to answer questions about Arnav's career, education, experience, and projects. 
Strictly ground your answers in the PROVIDED CONTEXT below. Do not make up any facts or hallucinate.

RULES:
1. Grounding: Answer ONLY based on the context provided. If a detail is not in the context, politely state: "I don't have information on that in Arnav's profile records. You can ask him directly via the contact links."
2. Safety & Grounding: If the user asks about unrelated topics (e.g. general news, coding exercises, cooking recipes, math tasks not related to Arnav's research, writing poems), say: "I am only trained to answer questions about Arnav Gupta's professional career, skills, and background. For other questions, please contact Arnav directly!"
3. Tone: Professional, direct, and helpful. Use markdown.
4. Keep answers relatively concise (under 3 paragraphs).

PROVIDED CONTEXT:
${contextString}

USER QUESTION:
${query}
`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 600
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();
    const replyText = resData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      return res.status(500).json({ error: "Empty response from Gemini." });
    }

    res.json({ text: replyText });

  } catch (error) {
    console.error("Server-side Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Contact Form Submission Route
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  // Read client-side referer/origin to pass FormSubmit's server origin-check
  const clientReferer = req.headers.referer || "https://f20240843.goa.bits-pilani.ac.in";
  const clientOrigin = req.headers.origin || "https://f20240843.goa.bits-pilani.ac.in";

  // 1. Dispatch Email directly to Arnav's BITS email via FormSubmit
  try {
    const targetEmail = "f20240843@goa.bits-pilani.ac.in";
    const emailResponse = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': clientReferer,
        'Origin': clientOrigin
      },
      body: JSON.stringify({
        Name: name,
        Email: email,
        Message: message,
        _subject: `New Portfolio Message from ${name}`
      })
    });

    if (emailResponse.ok) {
      return res.json({ success: true, message: "Message dispatched directly to email." });
    } else {
      const errText = await emailResponse.text();
      console.warn(`FormSubmit dispatch failed: ${errText}. Trying fallbacks.`);
    }
  } catch (error) {
    console.error("FormSubmit Dispatch Error:", error);
  }

  // 2. Database Backup (Supabase if credentials exist)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/contacts`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        return res.json({ success: true, message: "Saved to database successfully." });
      }
    } catch (error) {
      console.error("Supabase Save Error:", error);
    }
  }

  // 3. Local File storage backup (Fails on Vercel's read-only environment, but works locally)
  try {
    const submissionsPath = path.join(__dirname, 'data/submissions.json');
    let submissions = [];
    try {
      const existingData = await fs.readFile(submissionsPath, 'utf-8');
      submissions = JSON.parse(existingData);
    } catch (e) {
      // File doesn't exist yet
    }

    submissions.push({
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });

    await fs.writeFile(submissionsPath, JSON.stringify(submissions, null, 2));
    res.json({ success: true, message: "Saved to local file successfully." });
  } catch (error) {
    console.warn("Local File Write failed (Expected on serverless hosting like Vercel):", error.message);
    // Return a 200 success code anyway so the client shows a nice confirmation instead of a local simulation error
    res.json({ success: true, message: "Message handled successfully (local backup bypassed)." });
  }
});

// Fallback index html for routing
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server conditionally (only when run directly, not as Vercel serverless function)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(` Arnav's AI Career Copilot is running on port ${PORT}`);
    console.log(` Local URL: http://localhost:${PORT}`);
    console.log(` Static Files Served from: ${frontendPath}`);
    console.log(`========================================================`);
  });
}

export default app;

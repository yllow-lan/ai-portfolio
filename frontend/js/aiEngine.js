// AI Grounding and Response Engine
// Handles both offline search and online Gemini API RAG requests

// Data loaded via global script tag (window.portfolioData)

/**
 * Clean and tokenize text into keywords
 */
function tokenize(text) {
  return text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
    .split(/\s+/)
    .filter(token => token.length > 2); // filter out short words
}

/**
 * Standard Offline QA Matching using Jaccard Similarity on keywords
 */
function getOfflineResponse(query) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return "Please enter a valid question about Arnav's career or skills.";
  }

  let bestMatch = null;
  let highestScore = 0;

  for (const pair of portfolioData.qnaPairs) {
    // Check keyword intersections
    let matches = 0;
    for (const token of queryTokens) {
      if (pair.keywords.some(kw => kw.includes(token) || token.includes(kw))) {
        matches++;
      }
    }
    
    // Jaccard similarity score
    const union = new Set([...queryTokens, ...pair.keywords]).size;
    const score = matches / (union || 1);

    if (score > highestScore) {
      highestScore = score;
      bestMatch = pair;
    }
  }

  // Threshold for matching
  if (highestScore > 0.08) {
    return bestMatch.answer;
  }

  // Fallback: Dynamic scanning of projects and experience if keywords exist
  const matchedProjects = [];
  for (const project of portfolioData.projects) {
    const projTokens = tokenize(project.title + " " + project.description + " " + project.tag);
    const intersect = queryTokens.filter(t => projTokens.includes(t));
    if (intersect.length > 0) {
      matchedProjects.push(project);
    }
  }

  const matchedExperience = [];
  for (const exp of portfolioData.experience) {
    const expTokens = tokenize(exp.company + " " + exp.role + " " + exp.description);
    const intersect = queryTokens.filter(t => expTokens.includes(t));
    if (intersect.length > 0) {
      matchedExperience.push(exp);
    }
  }

  if (matchedProjects.length > 0 || matchedExperience.length > 0) {
    let response = `I found some information related to your query in Arnav's profile:\n\n`;
    if (matchedProjects.length > 0) {
      response += `### Selected Projects:\n`;
      matchedProjects.forEach(p => {
        response += `**${p.title}** (${p.tag}):\n`;
        response += `* ${p.description}\n`;
        p.bullets.forEach(b => {
          response += `* ${b}\n`;
        });
        response += `\n`;
      });
    }
    if (matchedExperience.length > 0) {
      response += `### Professional Experience:\n`;
      matchedExperience.forEach(exp => {
        response += `**${exp.company}** - ${exp.role} (${exp.duration}):\n`;
        response += `* ${exp.description}\n`;
        exp.bullets.forEach(b => {
          response += `* ${b}\n`;
        });
        response += `\n`;
      });
    }
    return response;
  }

  // Generic fallback if nothing matches
  return "I'm not fully sure about that detail from Arnav's portfolio. You can try asking about his **CUDA Matrix Multiplication** work, **DASH Lab LLM Inference Study**, his studies at **BITS Pilani**, or use the Contact Form on the left to reach out to him directly!";
}

/**
 * Online RAG mode using Gemini API
 */
async function getLiveGeminiResponse(query, apiKey) {
  // 1. Prepare grounding context from portfolioData
  const contextString = `
ABOUT ARNAV GUPTA:
${portfolioData.personal.aboutLong}

EDUCATION:
${portfolioData.education.map(e => `- ${e.institution}: ${e.degree} (${e.duration}), ${e.gpa}. Coursework: ${e.courses.join(', ')}`).join('\n')}

EXPERIENCE:
${portfolioData.experience.map(exp => `- ${exp.company} - ${exp.role} (${exp.duration}): ${exp.description}\n  ${exp.bullets.map(b => `  * ${b}`).join('\n')}`).join('\n')}

PROJECTS:
${portfolioData.projects.map(p => `- ${p.title} (${p.tag}) [${p.metrics}]: ${p.description}\n  ${p.bullets.map(b => `  * ${b}`).join('\n')}`).join('\n')}

SKILLS:
${portfolioData.skills.categories.map(c => `- ${c.name}: ${c.items.join(', ')}`).join('\n')}

CONTACT INFO:
- Email: ${portfolioData.personal.email}
- GitHub: ${portfolioData.personal.github}
- LinkedIn: ${portfolioData.personal.linkedin}
`;

  // 2. Build system instruction prompt
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

  // 3. Make the API Call to Gemini
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

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!replyText) {
      return "I received an empty response from the AI model. Please try again.";
    }

    return replyText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return `**Error contacting AI Engine:** ${error.message}. (Note: You can toggle off Live Mode in Settings to use the local Offline Grounding Engine instead).`;
  }
}

// Global attachments
window.getOfflineResponse = getOfflineResponse;
window.getLiveGeminiResponse = getLiveGeminiResponse;

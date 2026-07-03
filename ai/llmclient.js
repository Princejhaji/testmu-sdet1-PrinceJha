// ai/llmClient.js
// Sends a prompt to Groq's free API and returns the plain-text response.

require('dotenv').config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

async function askLLM(systemPrompt, userPrompt) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return 'AI explanation unavailable: GROQ_API_KEY is not set in .env';
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 300,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return `AI request failed (${response.status}): ${errText}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'No explanation returned.';
  } catch (err) {
    return `AI request threw an error: ${err.message}`;
  }
}

module.exports = { askLLM };

const { askLLM } = require('./llmClient');

const SYSTEM_PROMPT = `You are a senior QA automation engineer reviewing a failed 
Playwright test. You will be given the test title, the error message, and a 
truncated stack trace (and sometimes an API response body). Explain in plain 
English what most likely went wrong, in 2-3 sentences. Then give one concrete 
suggested fix or next debugging step in 1-2 sentences. Be specific and concise. 
Do not repeat the raw error verbatim back at the user — interpret it.`;

async function explainFailure(context) {
  const { testTitle, errorMessage, stackTrace, apiResponseBody } = context;

  const userPrompt = `
Test: ${testTitle}

Error message:
${errorMessage}

${stackTrace ? `Stack trace (truncated):\n${stackTrace.slice(0, 800)}` : ''}

${apiResponseBody ? `API response body:\n${JSON.stringify(apiResponseBody).slice(0, 800)}` : ''}
`.trim();

  const explanation = await askLLM(SYSTEM_PROMPT, userPrompt);
  return explanation;
}

module.exports = { explainFailure };
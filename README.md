# TestMu AI — SDET-1 Assessment

**AI-Native Quality Engineering Challenge** submission by Prince Jha.

An AI-native Playwright test automation framework built for TestMu AI's SDET-1
assessment — covering Login, Dashboard, and REST API regression testing, with
an LLM wired directly into the test framework as a **Failure Explainer**.

---

## Stack

- **Playwright** (JavaScript)
- **Node.js**
- **Groq API** (`llama-3.3-70b-versatile`) — free-tier LLM for test case
  generation prompts and the in-framework Failure Explainer

---

## Project Structure
tests/               → Playwright test specs (login, dashboard, api)
test-cases/           → Generated test cases (JSON) from Task 2 prompt engineering
page/                 → Page Object Model files
ai/                   → LLM integration code
├─ llmClient.js       → Groq API wrapper
└─ failureExplainer.js → Builds failure context + prompt, gets explanation
reports/              → Playwright HTML report output
prompts.md            → Raw prompts used for test case generation (Task 2)
ai-usage-log.md        → Every AI tool used, per task, and what it produced

### Environment variables
GROQ_API_KEY=your_key_here

Get a free key at [console.groq.com](https://console.groq.com) — no credit
card required.

## How to Run

```bash
npm install
npx playwright install --with-deps
cp .env.example .env      # add your GROQ_API_KEY (free — console.groq.com)
npx playwright test
npx playwright show-report
```

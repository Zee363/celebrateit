# CelebrateIT Server

This folder contains a minimal Node/Express backend that exposes a protected endpoint for generating AI replies for the Muse chat.

Quick start (development):

1. Install dependencies

```bash
cd server
npm install
```

2. Copy and edit environment variables

```bash
cp .env.example .env
# set OPENAI_API_KEY (or your Gemini key) in .env
```

3. Run in dev

```bash
npm run dev
```

Endpoint:
- POST `/api/muse-reply` — body: `{ message, bride, vendors, history }` → returns `{ text, meta? }`.

Next steps:
- Paste your Gemini/OpenAI SDK integration into `server/services/gemini.js`.
- Add authentication, rate-limiting, and moderation as required.

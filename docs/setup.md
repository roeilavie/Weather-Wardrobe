# Setup

## Prerequisites

- Node.js 20+ and npm 10+
- A Gemini API key: https://aistudio.google.com/apikey
- An Unsplash developer Access Key: https://unsplash.com/developers (create an application; the demo tier allows 50 requests/hour)
- Open-Meteo needs no key.

## Configure keys

```powershell
copy .env.example .env
```

Edit `.env` in the project root:

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | yes | | Google AI Studio key |
| `UNSPLASH_ACCESS_KEY` | yes | | Unsplash "Access Key" (not the Secret Key) |
| `PORT` | no | `3001` | Express port |
| `GEMINI_MODEL` | no | `gemini-2.5-flash` | Any Gemini model id |

`.env` is git-ignored. Never commit it.

## Run

```powershell
npm install
npm run dev     # development: Express (node --watch) on :3001 + Vite on :5173 (proxies /api)
```

Open http://localhost:5173.

Production:

```powershell
npm run build   # builds client/dist
npm start       # Express serves API and client on http://localhost:3001
```

Check configuration: `GET http://localhost:3001/api/health` reports whether each key is configured.

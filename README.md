# Weather Wardrobe

Type a city and your clothing preference. The app fetches today's forecast from Open-Meteo, asks Gemini for a single body-part-by-body-part outfit recommendation, and shows 4 clothing photos from Unsplash.

- Frontend: React + Vite (`client/`)
- Backend: Express (`server/`), proxies Gemini and Unsplash so API keys never reach the browser

## Quick start

```powershell
npm install
copy .env.example .env      # then fill in GEMINI_API_KEY and UNSPLASH_ACCESS_KEY
npm run dev                 # server on :3001, client on http://localhost:5173
```

Production: `npm run build` then `npm start` (Express serves `client/dist` on http://localhost:3001).

## Documentation

See [docs/README.md](docs/README.md): [setup](docs/setup.md), [architecture](docs/architecture.md), [API](docs/api.md), [prompt design](docs/prompt-design.md), [external APIs](docs/external-apis.md), [troubleshooting](docs/troubleshooting.md).

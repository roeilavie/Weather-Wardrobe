# Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| "GEMINI_API_KEY is missing" (500) | Create `.env` from `.env.example`, set the key, restart the server (`.env` is read at startup). |
| Warning "Images unavailable: UNSPLASH_ACCESS_KEY is missing" | Set `UNSPLASH_ACCESS_KEY` in `.env` and restart. The recommendation still works. |
| "Unsplash rejected the access key (401)" | Use the Access Key, not the Secret Key. |
| "Unsplash rate limit reached (403)" | Demo apps get 50 requests/hour; wait or apply for production. |
| "City not found" (404) | Check spelling; try a larger nearby city or add the country. |
| Gemini 429 / quota errors (502) | Free-tier quota hit; wait, or set a different `GEMINI_MODEL`. |
| Gemini 404 model not found | Fix `GEMINI_MODEL` in `.env`. |
| Browser shows network errors in dev | Ensure the server is running on port 3001 (Vite proxies `/api` there). If you changed `PORT`, update `client/vite.config.js`. |
| Port already in use | Change `PORT` in `.env` (and the Vite proxy target). |
| Recommendation shows as plain text | The model reply did not match `Part: item`; the raw text is displayed. |

Use `GET /api/health` to confirm which keys the server sees.

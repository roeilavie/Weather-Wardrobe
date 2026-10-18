# API

Base URL: `http://localhost:3001` (the Vite dev server proxies `/api` to it).

## GET /api/health

```json
{ "status": "ok", "geminiKeyConfigured": true, "unsplashKeyConfigured": true, "model": "gemini-2.5-flash" }
```

## POST /api/wardrobe

Request body (JSON):

| Field | Type | Rules |
| --- | --- | --- |
| `city` | string | required, max 100 chars |
| `preference` | string | optional, max 500 chars |

```powershell
curl.exe -X POST http://localhost:3001/api/wardrobe -H "Content-Type: application/json" -d "{\"city\":\"Tel Aviv\",\"preference\":\"casual\"}"
```

Success (200):

```json
{
  "location": { "name": "Tel Aviv", "country": "Israel", "admin1": "Tel Aviv", "latitude": 32.08, "longitude": 34.78, "timezone": "Asia/Jerusalem" },
  "weather": { "date": "2026-10-16", "tempMin": 21, "tempMax": 28, "precipitationProbability": 0, "windSpeedMax": 14, "weatherCode": 1, "conditions": "Mainly clear", "hourlyMin": 21, "hourlyMax": 28, "units": { "temperature": "°C", "wind": "km/h" } },
  "recommendation": {
    "items": [ { "part": "Head", "item": "Baseball cap" }, { "part": "Torso", "item": "Cotton t-shirt" } ],
    "raw": "Head: Baseball cap\nTorso: Cotton t-shirt"
  },
  "images": [ { "url": "https://images.unsplash.com/...", "alt": "...", "photographer": "Jane Doe", "photographerUrl": "https://unsplash.com/@jane?utm_source=weather_wardrobe&utm_medium=referral", "unsplashUrl": "https://unsplash.com/photos/...?utm_source=weather_wardrobe&utm_medium=referral" } ],
  "warnings": []
}
```

`warnings` holds non-fatal issues (e.g. images unavailable; `images` is then `[]`).

## Errors

Body: `{ "error": "message", "source": "validation|open-meteo|gemini|unsplash|server" }`

| Status | Cause |
| --- | --- |
| 400 | Empty/too-long city, too-long preference, invalid JSON |
| 404 | City not found (or unknown route) |
| 500 | `GEMINI_API_KEY` missing, or internal error. A missing Unsplash key does not fail the request; it adds a warning. |
| 502 | Open-Meteo or Gemini unreachable / returned an error |

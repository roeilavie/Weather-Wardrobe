# External APIs

## Open-Meteo (no key)

- Geocoding: `GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1`
- Forecast: `GET https://api.open-meteo.com/v1/forecast?latitude&longitude&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,wind_speed_10m_max&hourly=temperature_2m&timezone=auto&forecast_days=1`
- WMO weather codes are mapped to labels in `server/services/weather.js`.
- Free for non-commercial use; fair-use rate limits (about 10,000 calls/day).

## Google Gemini

- SDK: `@google/genai`, `ai.models.generateContent({ model, contents, config: { systemInstruction } })`.
- Model from `GEMINI_MODEL` (default `gemini-2.5-flash`).
- Key from `GEMINI_API_KEY`. The free tier has per-minute and per-day quotas; exceeding them returns 429, surfaced as a 502 with `source: "gemini"`.

## Unsplash

- Search: `GET https://api.unsplash.com/search/photos?query=...&per_page=4&orientation=portrait` with header `Authorization: Client-ID {UNSPLASH_ACCESS_KEY}`.
- Demo apps are limited to 50 requests/hour. Each wardrobe request uses up to 5 searches plus up to 4 download triggers, so roughly 5-6 requests per use.
- Attribution rules (followed by the UI): show "Photo by {photographer} on Unsplash", link both to their Unsplash profile/site with `utm_source=weather_wardrobe&utm_medium=referral`.
- Download tracking: the server calls each photo's `links.download_location` when it is used (required by the API guidelines).
- Hotlink the `urls.small` image URLs directly; do not re-host.

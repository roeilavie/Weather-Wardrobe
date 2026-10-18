# Architecture

An npm-workspaces monorepo with a React client and an Express server. The server orchestrates three external services; the browser only talks to the server, so keys stay private.

```mermaid
flowchart LR
  B[Browser<br/>React + Vite] -->|POST /api/wardrobe| S[Express server]
  S -->|geocode + forecast| OM[Open-Meteo]
  S -->|generateContent| G[Gemini]
  S -->|search photos| U[Unsplash]
```

## Request sequence

```mermaid
sequenceDiagram
  participant C as Client
  participant S as Server
  participant OM as Open-Meteo
  participant G as Gemini
  participant U as Unsplash
  C->>S: POST /api/wardrobe {city, preference}
  S->>S: validate input (400)
  S->>OM: geocoding search (404 if none)
  S->>OM: forecast (daily + hourly)
  S->>G: system prompt + weather/preference message
  G-->>S: "Part: item" lines
  S->>S: parse into items
  S->>U: search per item (up to 4)
  S->>U: trigger download_location
  S-->>C: {location, weather, recommendation, images, warnings}
```

## Layout

| Path | Responsibility |
| --- | --- |
| `server/index.js` | App setup, `/api/health`, static serving, error handler |
| `server/config.js` | Loads root `.env`, exports config and `HttpError` |
| `server/routes/wardrobe.js` | `POST /api/wardrobe` orchestration |
| `server/services/weather.js` | Open-Meteo geocoding, forecast, WMO code labels |
| `server/services/gemini.js` | System prompt, user message, call, parsing |
| `server/services/images.js` | Unsplash search, attribution fields, download trigger |
| `client/src` | `App`, `api.js`, components `SearchForm`, `WeatherCard`, `Recommendation`, `ImageGrid` |

## Error handling

Errors are `HttpError(status, message, source)`. Input problems are 400, unknown city 404, upstream failures 502 (a missing server key is 500), each with a `source`. Image failures are non-fatal: the response still succeeds with `images: []` and a `warnings` entry.

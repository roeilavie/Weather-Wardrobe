# Prompt Design

## System instruction (verbatim, typos intentional)

Defined as `SYSTEM_PROMPT` in `server/services/gemini.js` and sent as `config.systemInstruction`:

```
You are Wardrobe Wheather assistant. Given the temparture forcast and user preference, provide recommendations for what to wear. Only provide a single recommendation for the duration of the day. Provide the answer as a short mapping of type of clothing (e.g head, leg, torso, etc) and what to wear. Your response should include nothing else except the recommendation. Only provide recommendations for distinct body parts. be definitive in your recommendations, no "or"s.
```

Do not "fix" the spelling; the text is kept exactly as supplied.

## User message

Built by `buildUserMessage()`:

```
City: Tel Aviv, Tel Aviv, Israel
Date: 2026-10-16
Temperature: min 21°C, max 28°C
Hourly temperature range: 21°C to 28°C
Chance of precipitation: 0%
Max wind speed: 14 km/h
Conditions: Mainly clear
User preference: casual
```

## Output parsing

The prompt asks for a short mapping, so replies look like `Head: Baseball cap`. `parseRecommendation()` strips bullets and markdown bold, then splits each line on the first `:`/dash into `{part, item}`. The unparsed text is always returned as `recommendation.raw`; the UI falls back to it when no lines parse.

## Rationale

- Single per-day recommendation and "no ors" make each item usable as an Unsplash search query.
- Distinct body parts avoid duplicate items.
- "Nothing else" keeps the output machine-parseable.

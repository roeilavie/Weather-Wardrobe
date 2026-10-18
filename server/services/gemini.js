import { GoogleGenAI } from '@google/genai';
import { config, HttpError } from '../config.js';

// Kept VERBATIM from the product brief (typos included) - do not "fix".
export const SYSTEM_PROMPT =
  'You are Wardrobe Wheather assistant. Given the temparture forcast and user preference, provide recommendations for what to wear. Only provide a single recommendation for the duration of the day. Provide the answer as a short mapping of type of clothing (e.g head, leg, torso, etc) and what to wear. Your response should include nothing else except the recommendation. Only provide recommendations for distinct body parts. be definitive in your recommendations, no "or"s.';

export function buildUserMessage({ location, weather, preference }) {
  const place = [location.name, location.admin1, location.country].filter(Boolean).join(', ');
  const hourlyLine =
    weather.hourlyMin != null
      ? `Hourly temperature range: ${weather.hourlyMin}°C to ${weather.hourlyMax}°C`
      : 'Hourly temperature range: unavailable';
  return [
    `City: ${place}`,
    `Date: ${weather.date}`,
    `Temperature: min ${weather.tempMin}°C, max ${weather.tempMax}°C`,
    hourlyLine,
    `Chance of precipitation: ${weather.precipitationProbability ?? 'unknown'}%`,
    `Max wind speed: ${weather.windSpeedMax} km/h`,
    `Conditions: ${weather.conditions}`,
    `User preference: ${preference || 'none specified'}`,
  ].join('\n');
}

// Parse lines like "Head: beanie", "- **Torso**: wool sweater", "Legs - jeans".
export function parseRecommendation(text) {
  const items = [];
  for (const line of text.split(/\r?\n/)) {
    const cleaned = line.replace(/\*\*|__|`/g, '').replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim();
    const m = cleaned.match(/^([^:\-–—]{1,40})\s*[:\-–—]\s*(.+)$/);
    if (m) items.push({ part: m[1].trim(), item: m[2].trim() });
  }
  return items;
}

export async function generate(ctx) {
  if (!config.geminiApiKey) {
    throw new HttpError(500, 'GEMINI_API_KEY is missing. Add it to the .env file in the project root and restart the server.', 'gemini');
  }
  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
  let response;
  try {
    response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: buildUserMessage(ctx),
      config: { systemInstruction: SYSTEM_PROMPT },
      temperature: 0.3
    });
  } catch (e) {
    throw new HttpError(502, `Gemini request failed: ${e.message}`, 'gemini');
  }
  const raw = (response.text || '').trim();
  if (!raw) throw new HttpError(502, 'Gemini returned an empty response.', 'gemini');
  return { items: parseRecommendation(raw), raw };
}

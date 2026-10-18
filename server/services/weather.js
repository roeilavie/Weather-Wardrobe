import { HttpError } from '../config.js';

const WMO = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  66: 'Light freezing rain', 67: 'Heavy freezing rain',
  71: 'Slight snowfall', 73: 'Moderate snowfall', 75: 'Heavy snowfall', 77: 'Snow grains',
  80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
  85: 'Slight snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
};

async function getJson(url, what) {
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  } catch (e) {
    throw new HttpError(502, `Could not reach Open-Meteo ${what} service: ${e.message}`, 'open-meteo');
  }
  if (!res.ok) {
    throw new HttpError(502, `Open-Meteo ${what} request failed (${res.status}).`, 'open-meteo');
  }
  return res.json();
}

export async function geocode(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const data = await getJson(url, 'geocoding');
  const r = data.results?.[0];
  if (!r) throw new HttpError(404, `City not found: "${city}". Check the spelling and try again.`, 'open-meteo');
  return { name: r.name, country: r.country, admin1: r.admin1, latitude: r.latitude, longitude: r.longitude, timezone: r.timezone };
}

export async function getForecast({ latitude, longitude }) {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${latitude}&longitude=${longitude}` +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,wind_speed_10m_max' +
    '&hourly=temperature_2m&timezone=auto&forecast_days=1';
  const data = await getJson(url, 'forecast');
  const d = data.daily;
  if (!d?.time?.length) throw new HttpError(502, 'Open-Meteo returned no forecast data.', 'open-meteo');
  const hourly = (data.hourly?.temperature_2m || []).filter((t) => typeof t === 'number');
  const code = d.weathercode?.[0];
  return {
    date: d.time[0],
    tempMax: d.temperature_2m_max[0],
    tempMin: d.temperature_2m_min[0],
    precipitationProbability: d.precipitation_probability_max?.[0] ?? null,
    windSpeedMax: d.wind_speed_10m_max?.[0] ?? 0,
    weatherCode: code,
    conditions: WMO[code] || 'Unknown',
    hourlyMin: hourly.length ? Math.min(...hourly) : null,
    hourlyMax: hourly.length ? Math.max(...hourly) : null,
    hourly,
    units: { temperature: '°C', wind: 'km/h' },
  };
}

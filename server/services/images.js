import { config, HttpError } from '../config.js';

const API = 'https://api.unsplash.com';
const UTM = 'utm_source=weather_wardrobe&utm_medium=referral';

function headers() {
  return { Authorization: `Client-ID ${config.unsplashAccessKey}`, 'Accept-Version': 'v1' };
}

async function search(query, perPage) {
  const url = `${API}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=portrait`;
  let res;
  try {
    res = await fetch(url, { headers: headers(), signal: AbortSignal.timeout(10000) });
  } catch (e) {
    throw new HttpError(502, `Could not reach Unsplash: ${e.message}`, 'unsplash');
  }
  if (res.status === 401) throw new HttpError(502, 'Unsplash rejected the access key (401). Check UNSPLASH_ACCESS_KEY.', 'unsplash');
  if (res.status === 403) throw new HttpError(502, 'Unsplash rate limit reached (403).', 'unsplash');
  if (!res.ok) throw new HttpError(502, `Unsplash request failed (${res.status}).`, 'unsplash');
  const data = await res.json();
  return data.results || [];
}

function mapPhoto(p) {
  return {
    id: p.id,
    url: p.urls?.small,
    alt: p.alt_description || p.description || 'Clothing',
    photographer: p.user?.name,
    photographerUrl: `${p.user?.links?.html}?${UTM}`,
    unsplashUrl: `${p.links?.html}?${UTM}`,
    downloadLocation: p.links?.download_location,
  };
}

// Required by Unsplash API guidelines; fire-and-forget.
function triggerDownload(photo) {
  if (!photo.downloadLocation) return;
  fetch(photo.downloadLocation, { headers: headers(), signal: AbortSignal.timeout(10000) }).catch(() => {});
}

export async function findImages(items) {
  if (!config.unsplashAccessKey) {
    throw new HttpError(500, 'UNSPLASH_ACCESS_KEY is missing. Add it to the .env file in the project root and restart the server.', 'unsplash');
  }
  const picked = new Map();
  const add = (p) => { if (p?.urls?.small && !picked.has(p.id)) picked.set(p.id, mapPhoto(p)); };

  const queries = items.slice(0, 4).map((i) => `${i.item} clothing`);
  const results = await Promise.allSettled(queries.map((q) => search(q, 1)));
  let firstError = null;
  for (const r of results) {
    if (r.status === 'fulfilled') add(r.value[0]);
    else firstError ||= r.reason;
  }
  if (picked.size < 4) {
    const combined = items.map((i) => i.item).join(' ').slice(0, 100) || 'outfit';
    try {
      for (const p of await search(`${combined} clothing`, 8)) { if (picked.size < 4) add(p); }
    } catch (e) {
      firstError ||= e;
    }
  }
  if (picked.size === 0 && firstError) throw firstError;

  const photos = [...picked.values()].slice(0, 4);
  photos.forEach(triggerDownload);
  return photos.map(({ downloadLocation, id, ...rest }) => rest);
}

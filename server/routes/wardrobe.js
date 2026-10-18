import { Router } from 'express';
import { HttpError } from '../config.js';
import { geocode, getForecast } from '../services/weather.js';
import { generate } from '../services/gemini.js';
import { findImages } from '../services/images.js';

const router = Router();

router.post('/wardrobe', async (req, res, next) => {
  try {
    const city = typeof req.body?.city === 'string' ? req.body.city.trim() : '';
    const preference = typeof req.body?.preference === 'string' ? req.body.preference.trim() : '';
    if (!city) throw new HttpError(400, 'City is required.', 'validation');
    if (city.length > 100) throw new HttpError(400, 'City must be 100 characters or fewer.', 'validation');
    if (preference.length > 500) throw new HttpError(400, 'Preference must be 500 characters or fewer.', 'validation');

    const location = await geocode(city);
    const weather = await getForecast(location);
    const recommendation = await generate({ location, weather, preference });

    const warnings = [];
    let images = [];
    try {
      images = await findImages(recommendation.items);
    } catch (e) {
      warnings.push(`Images unavailable: ${e.message}`);
    }
    if (recommendation.items.length === 0) warnings.push('Could not parse the recommendation into items; showing raw text.');

    const { hourly, ...weatherOut } = weather;
    res.json({ location, weather: weatherOut, recommendation, images, warnings });
  } catch (e) {
    next(e);
  }
});

export default router;

import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { config, rootDir, HttpError } from './config.js';
import wardrobeRouter from './routes/wardrobe.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiKeyConfigured: Boolean(config.geminiApiKey),
    unsplashKeyConfigured: Boolean(config.unsplashAccessKey),
    model: config.geminiModel,
  });
});

app.use('/api', wardrobeRouter);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

// Serve the built client in production.
const dist = path.join(rootDir, 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, source: err.source });
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body.', source: 'validation' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error.', source: 'server' });
});

app.listen(config.port, () => console.log(`Weather Wardrobe server listening on http://localhost:${config.port}`));

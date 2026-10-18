import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const rootDir = path.resolve(__dirname, '..');

// Load the .env that lives in the project root.
dotenv.config({ path: path.join(rootDir, '.env') });

export const config = {
  port: Number(process.env.PORT) || 3001,
  geminiApiKey: (process.env.GEMINI_API_KEY || '').trim(),
  geminiModel: (process.env.GEMINI_MODEL || '').trim() || 'gemini-2.5-flash',
  unsplashAccessKey: (process.env.UNSPLASH_ACCESS_KEY || '').trim(),
};

export class HttpError extends Error {
  constructor(status, message, source) {
    super(message);
    this.status = status;
    this.source = source;
  }
}

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: 3001,

  cors: {
    origin: 'http://localhost:5173',

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  },

  databasePath: path.resolve(
    __dirname,
    '../../../data/salary-tracker.db'
  ),
};
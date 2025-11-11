// backend/server.js
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './utils/db.js';
import { createIndexes } from './utils/createIndexes.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import serviceRoutes from './routes/services.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.set('trust proxy', 1);

// ---------- middleware (no CORS) ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'my-super-secret-session-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24h
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
    },
  })
);

// ---------- API routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'ServiceHub API is running' });
});

// Optional: 404 for unknown API paths (do this BEFORE SPA catch-all)
app.use('/api', (_req, res) =>
  res.status(404).json({ error: 'Route not found' })
);

// ---------- Serve React in production (same origin) ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuild = path.join(__dirname, '../frontend/build');

app.use(express.static(clientBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

// ---------- bootstrap ----------
async function startServer() {
  try {
    await connectDB();
    await createIndexes();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

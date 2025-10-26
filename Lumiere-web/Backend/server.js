// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './src/config/db.js';
import productRoutes from './src/routes/productRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';
import contactRoutes from './src/routes/contactRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS allow-list via CORS_ORIGIN="http://localhost:5173,https://yourdomain.com"
const allow = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // tools like curl/postman
    if (allow.length === 0 || allow.includes('*') || allow.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, service: 'Lumière Products API' }));
app.get('/healthz', (_req, res) => res.json({
  ok: true,
  mongoState: mongoose.connection.readyState // 0=disconnected,1=connected,2=connecting,3=disconnecting
}));

app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`✅ Products API running on http://localhost:${PORT}`));

// Log listen errors (e.g., EADDRINUSE)
server.on('error', (err) => {
  console.error('💥 Server error:', err?.message);
});

// Try DB connect but NEVER process.exit on failure
connectDB();

// graceful shutdown
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, async () => {
    console.log(`\nReceived ${sig}, shutting down...`);
    await disconnectDB();
    server.close(() => process.exit(0));
  });
}

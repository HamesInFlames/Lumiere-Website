// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './src/config/db.js';

// Routes
import productRoutes from './src/routes/productRoutes.js';
import contactRoutes from "./src/routes/contactRoutes.js";
import authRoutes from './src/routes/authRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';

// Middleware
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS allow-list via CORS_ORIGIN="http://localhost:5173,https://yourdomain.com"
const allow = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return cb(null, true);
    
    // Allow all if no CORS_ORIGIN is set or if * is specified
    if (allow.length === 0 || allow.includes('*')) return cb(null, true);
    
    // Check if origin is in allow list
    if (allow.includes(origin)) return cb(null, true);
    
    // For development, also allow localhost variations and local network IPs
    if (process.env.NODE_ENV !== 'production') {
      const localhostPatterns = [
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/127\.0\.0\.1:\d+$/,
        /^http:\/\/192\.168\.\d+\.\d+:\d+$/, // Allow local network IPs (192.168.x.x)
        /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,  // Allow private network IPs (10.x.x.x)
        /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:\d+$/, // Allow private network IPs (172.16-31.x.x)
      ];
      if (localhostPatterns.some(pattern => pattern.test(origin))) {
        return cb(null, true);
      }
    }
    
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Health checks
app.get('/', (_req, res) => res.json({ ok: true, service: 'Lumière Pâtisserie API' }));
app.get('/healthz', (_req, res) => res.json({
  ok: true,
  mongoState: mongoose.connection.readyState // 0=disconnected,1=connected,2=connecting,3=disconnecting
}));

// API Routes
app.use('/api/products', productRoutes);
app.use("/api/contact", contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
// Listen on all network interfaces (0.0.0.0) to allow mobile access
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Lumière API running on http://localhost:${PORT}`);
  console.log(`📱 Accessible from phone at: http://192.168.2.103:${PORT}`);
});

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

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import analyticsRoutes from './routes/analytics';
import couponRoutes from './routes/coupon';
import uploadRoutes from './routes/upload';
import messageRoutes from './routes/messages';
import orderRoutes from './routes/orders';
import categoriesRoutes from './routes/categories';

import fs from 'fs';
import path from 'path';
import Product from './models/Product';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5007;

// =======================
// MIDDLEWARE
// =======================

// ✅ FIXED CORS (IMPORTANT)
const allowedOrigins = [
  'http://localhost:3000',
  'https://zippy-kangaroo-914e14.netlify.app',
  process.env.FRONTEND_URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// =======================
// HEALTH CHECK ROUTE
// =======================
app.get('/', (req, res) => {
  res.send('API is running...');
});

// =======================
// ROUTES
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoriesRoutes);

// =======================
// DEBUG ROUTE (ADDED)
// =======================
app.get('/api/test', (req, res) => {
  res.json({ message: 'API routes working' });
});

// =======================
// 🔥 LIVE SEED ROUTE (ADDED)
// =======================
app.get('/api/seed-products', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/store.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);

    await Product.deleteMany();
    await Product.insertMany(data.products);

    res.json({ message: '✅ Products seeded on LIVE DB' });
  } catch (error) {
    console.error('SEED ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Seeding failed',
    });
  }
});

// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('GLOBAL ERROR:', err);

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
);

// =======================
// START SERVER AFTER DB
// =======================
const startServer = async () => {
  try {
    await connectDB(); // ✅ wait for DB connection

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
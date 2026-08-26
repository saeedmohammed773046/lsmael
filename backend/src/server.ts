import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { bootstrapDatabase } from './utils/bootstrap';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const allowedOrigins = (process.env.CORS_ORIGINS || 'https://ismael-frontend-w3h7.onrender.com,https://ismael-w3h7.onrender.com,*')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev to support dynamic preview ports
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static uploads serving
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Lightweight Cron / Keep-Alive root endpoints
app.get('/cron', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.status(200).send('OK');
});
app.head('/cron', (req, res) => {
  res.status(200).end();
});
app.get('/health', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send('OK');
});

// Mount REST API
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(` Ismail Wedding & Events API Server running on port ${PORT}`);
  console.log(` Base API URL: https://ismael-backend.onrender.com/api`);
  console.log(` Static Uploads: https://ismael-backend.onrender.com/uploads`);
  console.log(` Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`=======================================================`);
  
  // Auto-bootstrap admin user, settings, and categories if database is empty
  await bootstrapDatabase();
});

export default app;

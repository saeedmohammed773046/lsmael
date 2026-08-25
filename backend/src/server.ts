import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:3002')
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

// Mount REST API
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Ismail Wedding & Events API Server running on port ${PORT}`);
  console.log(` Base API URL: http://localhost:${PORT}/api`);
  console.log(` Static Uploads: http://localhost:${PORT}/uploads`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
});

export default app;

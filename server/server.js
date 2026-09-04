const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const { connectDB, getDBStatus } = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const projectRoutes = require('./routes/projectRoutes');
const { generalLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (with automatic local persistent fallback)
connectDB();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : ['*'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, file://)
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy does not allow access from the specified Origin.'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply General Rate Limiter to all /api routes
app.use('/api', generalLimiter);

// Health & Info Endpoint
app.get('/api/health', (req, res) => {
  const dbInfo = getDBStatus();
  res.status(200).json({
    status: 'online',
    server: 'WhiteGod Portfolio Grimoire API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: dbInfo,
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);

// Serve static frontend assets (index.html, assets, portfolio.html, etc.)
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir));

// API Root Info Endpoint
app.get('/api', (req, res) => {
  res.json({
    message: '⚔ WhiteGod Portfolio API Server is active and vigilant.',
    healthCheck: '/api/health',
    endpoints: {
      contact: 'POST /api/contact',
      messages: 'GET /api/contact/messages',
      projects: 'GET /api/projects',
    },
  });
});

// Root route: Serve frontend index.html if available, or API JSON fallback
app.get('/', (req, res) => {
  const indexPath = path.join(rootDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({
    message: '⚔ WhiteGod Portfolio API Server is active and vigilant.',
    healthCheck: '/api/health',
    endpoints: {
      contact: 'POST /api/contact',
      messages: 'GET /api/contact/messages',
      projects: 'GET /api/projects',
    },
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Listening (when run directly in Node)
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`⚡ WhiteGod Portfolio API Server running on port ${PORT}`);
    console.log(`🔮 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📜 Contact Endpoint: http://localhost:${PORT}/api/contact`);
    console.log(`======================================================\n`);
  });
  app.server = server;
}

module.exports = app;

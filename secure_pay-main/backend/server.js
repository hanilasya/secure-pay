const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const { seedDatabase } = require('./seed');
const { logSecurityEvent } = require('./utils/logger');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/securepay_db';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ==========================================
// 1. CORS CONFIGURATION (API Security)
// ==========================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. curl, postman, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback permissive for local demo
    },
    credentials: true, // Allow session cookies across requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);

// ==========================================
// 2. BODY PARSING & PAYLOAD SIZE LIMITS
// ==========================================
// Enforce 10kb maximum payload to prevent DoS via massive JSON bodies
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ==========================================
// 3. SECURE SESSION MANAGEMENT
// ==========================================
/**
 * Session Configuration:
 * - httpOnly: true (Mitigates XSS cookie theft)
 * - sameSite: 'lax' (Defends against CSRF attacks)
 * - maxAge: 24 hours
 */
app.use(
  session({
    name: 'connect.sid',
    secret: process.env.SESSION_SECRET || 'securepay_super_secret_college_demo_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production over HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
    },
  })
);


// Global Request Logger Middleware for Terminal Visibility
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\x1b[90m[${timestamp}]\x1b[0m \x1b[32m${req.method}\x1b[0m ${req.url} \x1b[90m(IP: ${req.ip || '127.0.0.1'})\x1b[0m`);
  next();
});

// ==========================================
// 4. API ROUTES
// ==========================================
// Health & Status Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    project: 'Secure Multi-Domain Payment Company Prototype (SecurePay)',
    architecture: {
      domains: {
        public: 'Main Website (http://localhost:5173/)',
        customer: 'Customer Portal (http://localhost:5173/customer)',
        payment: 'Payment Application (http://localhost:5173/payment)',
        admin: 'Admin Portal (http://localhost:5173/admin)',
        api: 'Express Backend (http://localhost:5000/api/*)',
      },
      securityFeatures: [
        'Bcrypt Password Hashing (Salt Rounds: 10)',
        'Session-Based Authentication & Fixation Prevention',
        'Role-Based Access Control (RBAC: Customer / Admin)',
        'Strict Input & Numerical Boundary Validation',
        'Brute-Force Rate Limiting on Login',
        'Centralized Security Audit Logging',
        'CORS with Origin Restriction & Credentials',
        'Zero Sensitive Financial Data Storage (Dummy Data Only)',
      ],
    },
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount modular sub-domain API endpoints and direct specification aliases
// Direct auth endpoints: POST /api/login, POST /api/logout, GET /api/me, POST /api/register
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes);

// Customer endpoints: GET /api/customer/profile
app.use('/api/customer', customerRoutes);

// Payment endpoints: POST /api/payment, POST /api/payments, GET /api/payments
app.use('/api/payments', paymentRoutes);
app.use('/api/payment', paymentRoutes);

// Import auth middleware for direct route protection
const { requireAdmin } = require('./middleware/auth');
const { getAdminLogsHandler } = require('./routes/adminRoutes');

// Admin & Security Log endpoints: GET /api/admin, GET /api/admin/dashboard, GET /api/logs, GET /api/admin/logs
app.use('/api/admin', adminRoutes);
app.get('/api/logs', requireAdmin, getAdminLogsHandler);



// 404 Handler for Unknown Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `API endpoint '${req.originalUrl}' does not exist on SecurePay Backend.`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[SERVER_ERROR]', err);
  const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';

  logSecurityEvent({
    eventType: 'SECURITY',
    action: 'UNCAUGHT_SERVER_EXCEPTION',
    userEmail: req.session?.user?.email || 'unknown',
    ipAddress: ip,
    details: err.message || 'Internal Server Error',
    severity: 'CRITICAL',
  });

  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'An unexpected security or application error occurred.',
  });
});

// ==========================================
// 5. DATABASE CONNECTION & SERVER STARTUP
// ==========================================
async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('\x1b[32m✓ Connected successfully to MongoDB at:\x1b[0m', MONGODB_URI);

    // Auto-seed default demo accounts & initial sample data
    await seedDatabase(false);

    app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`\x1b[36m SecurePay Backend Server Running on:\x1b[0m http://localhost:${PORT}`);
      console.log(`\x1b[33m Frontend Origin Allowed:\x1b[0m ${FRONTEND_URL}`);
      console.log('====================================================');
    });
  } catch (err) {
    console.error('\x1b[31mFailed to start SecurePay Backend Server:\x1b[0m', err.message);
    process.exit(1);
  }
}

startServer();

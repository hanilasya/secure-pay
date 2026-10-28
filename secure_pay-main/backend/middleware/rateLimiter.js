const rateLimit = require('express-rate-limit');
const { logSecurityEvent } = require('../utils/logger');

/**
 * Login Rate Limiter
 * Demonstrates:
 * - Brute-force & credential stuffing defense
 * - Throttles consecutive failed/repeated requests per IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 25, // Limit each IP to 25 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    logSecurityEvent({
      eventType: 'SECURITY',
      action: 'RATE_LIMIT_EXCEEDED',
      userEmail: req.body?.email || 'unknown',
      ipAddress: ip,
      details: 'Too many login attempts from this IP. Rate limit triggered.',
      severity: 'CRITICAL',
    });

    res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: 'Too many login attempts from this IP. Please wait 15 minutes before trying again.',
    });
  },
});

module.exports = {
  loginLimiter,
};

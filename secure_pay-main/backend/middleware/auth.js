const { logSecurityEvent } = require('../utils/logger');

/**
 * Authentication Middleware: requireAuth
 * Checks whether a user has an active session.
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    logSecurityEvent({
      eventType: 'AUTH',
      action: 'UNAUTHENTICATED_ACCESS_ATTEMPT',
      userEmail: 'unauthenticated',
      ipAddress: ip,
      details: `Attempted to access protected route: ${req.originalUrl}`,
      severity: 'WARNING',
    });

    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required. Please log in to access this resource.',
    });
  }

  next();
}

/**
 * Authorization Middleware: requireAdmin
 * Role-Based Access Control (RBAC): Verifies the logged-in user has the 'admin' role.
 */
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required. Please log in as Administrator.',
    });
  }

  if (req.session.user.role !== 'admin') {
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    // Log privilege escalation / unauthorized admin route access
    logSecurityEvent({
      eventType: 'SECURITY',
      action: 'UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT',
      userEmail: req.session.user.email,
      ipAddress: ip,
      details: `Customer '${req.session.user.email}' attempted to access admin endpoint: ${req.originalUrl}`,
      severity: 'CRITICAL',
    });

    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Access Denied: You do not have permission to access the Admin Portal or administrative APIs.',
      attemptedResource: req.originalUrl,
    });
  }

  next();
}

/**
 * Authorization Middleware: requireCustomer
 * Verifies the user has the 'customer' role.
 */
function requireCustomer(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required. Please log in.',
    });
  }

  if (req.session.user.role !== 'customer') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Customer access only.',
    });
  }

  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  requireCustomer,
};

const { logSecurityEvent } = require('../utils/logger');

// Standard Email Regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate Login Request Body
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email address is required.');
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('Please provide a valid email address (e.g. user@example.com).');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    logSecurityEvent({
      eventType: 'VALIDATION',
      action: 'INVALID_LOGIN_INPUT',
      userEmail: email || 'unknown',
      ipAddress: ip,
      details: `Validation failed: ${errors.join('; ')}`,
      severity: 'WARNING',
    });

    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: errors[0],
      errors,
    });
  }

  // Normalize email
  req.body.email = email.trim().toLowerCase();
  next();
}

/**
 * Validate Registration Request Body
 */
function validateRegister(req, res, next) {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters.');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (role && !['customer', 'admin'].includes(role)) {
    errors.push('Role must be either "customer" or "admin".');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: errors[0],
      errors,
    });
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
}

/**
 * Validate Payment Creation Request Body
 * Enforces business logic & secure bounds for demo payments
 */
function validatePayment(req, res, next) {
  const { amount, recipient, description } = req.body;
  const errors = [];

  // Validate Amount
  const numAmount = Number(amount);
  if (amount === undefined || amount === null || isNaN(numAmount)) {
    errors.push('Payment amount must be a valid numeric value.');
  } else if (numAmount <= 0) {
    errors.push('Payment amount must be greater than ₹0 (no zero or negative values allowed).');
  } else if (numAmount > 100000) {
    errors.push('Payment amount exceeds demo transaction maximum limit of ₹1,00,000.');
  }

  // Validate Recipient
  if (!recipient || typeof recipient !== 'string' || recipient.trim().length < 2) {
    errors.push('Recipient name/store must be at least 2 characters long.');
  } else if (recipient.length > 100) {
    errors.push('Recipient name cannot exceed 100 characters.');
  }

  // Validate Description
  if (!description || typeof description !== 'string' || description.trim().length < 2) {
    errors.push('Payment description must be at least 2 characters long.');
  } else if (description.length > 200) {
    errors.push('Payment description cannot exceed 200 characters.');
  }

  if (errors.length > 0) {
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    logSecurityEvent({
      eventType: 'VALIDATION',
      action: 'INVALID_PAYMENT_PAYLOAD',
      userEmail: req.session?.user?.email || 'anonymous',
      ipAddress: ip,
      details: `Payment validation failed: ${errors.join('; ')}`,
      severity: 'WARNING',
    });

    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: errors[0],
      errors,
    });
  }

  req.body.amount = Number(numAmount.toFixed(2));
  req.body.recipient = recipient.trim();
  req.body.description = description.trim();
  next();
}

module.exports = {
  validateLogin,
  validateRegister,
  validatePayment,
};

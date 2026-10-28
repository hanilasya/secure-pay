const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validateLogin, validateRegister } = require('../middleware/validation');
const { requireAuth } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const { logSecurityEvent } = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a demo user (Password is hashed with bcrypt before saving)
 */
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logSecurityEvent({
        eventType: 'AUTH',
        action: 'REGISTRATION_CONFLICT',
        userEmail: email,
        ipAddress: ip,
        details: 'Attempted to register with an already existing email',
        severity: 'WARNING',
      });

      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'A user with this email address already exists.',
      });
    }

    // Hash the password using bcrypt with salt rounds = 10
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      role: role || 'customer',
    });

    await newUser.save();

    logSecurityEvent({
      eventType: 'AUTH',
      action: 'USER_REGISTERED',
      userEmail: email,
      ipAddress: ip,
      details: `New user registered with role: ${newUser.role}. Password securely hashed.`,
      severity: 'INFO',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Password securely hashed with bcrypt.',
      user: newUser.toSafeObject(),
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'An internal error occurred during registration.',
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticates user, compares bcrypt password, and establishes session
 */
router.post('/login', loginLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';

    // Look up user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Intentionally generic message to avoid email enumeration
      logSecurityEvent({
        eventType: 'AUTH',
        action: 'LOGIN_FAILED',
        userEmail: email,
        ipAddress: ip,
        details: 'Failed login attempt - Email not found in system',
        severity: 'WARNING',
      });

      return res.status(401).json({
        success: false,
        error: 'Invalid Credentials',
        message: 'Invalid email address or password.',
      });
    }

    // Compare provided password with stored bcrypt hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      logSecurityEvent({
        eventType: 'AUTH',
        action: 'LOGIN_FAILED',
        userEmail: email,
        ipAddress: ip,
        details: 'Failed login attempt - Incorrect password hash mismatch',
        severity: 'WARNING',
      });

      return res.status(401).json({
        success: false,
        error: 'Invalid Credentials',
        message: 'Invalid email address or password.',
      });
    }

    // Regenerate session to prevent Session Fixation attacks
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err);
        return res.status(500).json({
          success: false,
          error: 'Session Error',
          message: 'Failed to initialize secure session.',
        });
      }

      // Store only non-sensitive user identity in session
      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      logSecurityEvent({
        eventType: 'AUTH',
        action: 'LOGIN_SUCCESS',
        userEmail: user.email,
        ipAddress: ip,
        details: `Successful login as role: [${user.role}]. New session established (ID: ${req.sessionID}).`,
        severity: 'INFO',
      });

      res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}! Authentication successful.`,
        user: user.toSafeObject(),
        sessionId: req.sessionID,
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'An internal error occurred during authentication.',
    });
  }
});

/**
 * POST /api/auth/logout
 * Destroys user session and clears session cookie
 */
router.post('/logout', requireAuth, (req, res) => {
  const userEmail = req.session.user?.email || 'anonymous';
  const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';

  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({
        success: false,
        error: 'Logout Error',
        message: 'Could not log out at this time.',
      });
    }

    // Clear session cookie from client
    res.clearCookie('connect.sid', { path: '/' });
    res.clearCookie('securepay_sid', { path: '/' });


    logSecurityEvent({
      eventType: 'AUTH',
      action: 'LOGOUT_SUCCESS',
      userEmail,
      ipAddress: ip,
      details: 'User session destroyed and cookie cleared.',
      severity: 'INFO',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully. Session invalidated.',
    });
  });
});

/**
 * GET /api/auth/me
 * Returns currently authenticated user session state
 */
router.get('/me', async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      message: 'No active session found.',
    });
  }

  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: 'Session user no longer exists.',
      });
    }

    res.status(200).json({
      success: true,
      authenticated: true,
      user: user.toSafeObject(),
      sessionId: req.sessionID,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to retrieve session info.',
    });
  }
});

module.exports = router;

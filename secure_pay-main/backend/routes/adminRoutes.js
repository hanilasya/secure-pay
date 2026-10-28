const express = require('express');
const User = require('../models/User');
const Payment = require('../models/Payment');
const SecurityLog = require('../models/SecurityLog');
const { requireAdmin } = require('../middleware/auth');
const { logSecurityEvent } = require('../utils/logger');

const router = express.Router();

// Apply requireAdmin middleware to ALL admin routes
router.use(requireAdmin);

/**
 * GET /api/admin and GET /api/admin/dashboard
 * Admin-only endpoint: Summary statistics and cybersecurity metrics
 */
const getAdminDashboardHandler = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    const totalPayments = await Payment.countDocuments();
    const paymentsAggregation = await Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, totalVolume: { $sum: '$amount' } } },
    ]);
    const totalVolume = paymentsAggregation.length > 0 ? paymentsAggregation[0].totalVolume : 0;

    const failedLogins = await SecurityLog.countDocuments({ action: 'LOGIN_FAILED' });
    const unauthorizedAccessAttempts = await SecurityLog.countDocuments({ 
      action: { $in: ['UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT', 'UNAUTHENTICATED_ACCESS_ATTEMPT'] } 
    });
    const totalSecurityEvents = await SecurityLog.countDocuments();

    const recentLogs = await SecurityLog.find().sort({ timestamp: -1 }).limit(10);
    const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(5);

    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    logSecurityEvent({
      eventType: 'ACCESS',
      action: 'ADMIN_DASHBOARD_ACCESSED',
      userEmail: req.session.user.email,
      ipAddress: ip,
      details: 'Administrator loaded system dashboard metrics.',
      severity: 'INFO',
    });

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          totalCustomers,
          totalAdmins,
          totalPayments,
          totalVolume,
          failedLogins,
          unauthorizedAccessAttempts,
          totalSecurityEvents,
        },
        systemStatus: {
          server: 'ONLINE',
          database: 'CONNECTED',
          sessionStore: 'ACTIVE',
          rateLimiting: 'ACTIVE',
          domainSeparation: 'ACTIVE (SIMULATED)',
          encryption: 'BCRYPT_SALT_10',
        },
        recentLogs,
        recentPayments,
      },
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to generate admin dashboard metrics.',
    });
  }
};

router.get('/', getAdminDashboardHandler);
router.get('/dashboard', getAdminDashboardHandler);


/**
 * GET /api/admin/logs and GET /api/logs
 * Admin-only endpoint: Retrieve system audit logs with optional filters
 */
const getAdminLogsHandler = async (req, res) => {
  try {
    const { eventType, severity, limit = 50 } = req.query;
    const filter = {};

    if (eventType) {
      filter.eventType = eventType.toUpperCase();
    }
    if (severity) {
      filter.severity = severity.toUpperCase();
    }

    const logs = await SecurityLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(Math.min(100, Number(limit) || 50));

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (err) {
    console.error('Admin logs error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to retrieve security audit logs.',
    });
  }
};

router.get('/logs', getAdminLogsHandler);

/**
 * GET /api/admin/users
 * Admin-only endpoint: List all users in database (sanitized, no password hashes)
 */
const getAdminUsersHandler = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to retrieve user list.',
    });
  }
};

router.get('/users', getAdminUsersHandler);

module.exports = router;
module.exports.getAdminDashboardHandler = getAdminDashboardHandler;
module.exports.getAdminLogsHandler = getAdminLogsHandler;
module.exports.getAdminUsersHandler = getAdminUsersHandler;


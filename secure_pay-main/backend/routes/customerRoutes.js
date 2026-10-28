const express = require('express');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { requireAuth } = require('../middleware/auth');
const { logSecurityEvent } = require('../utils/logger');

const router = express.Router();

/**
 * GET /api/customer and GET /api/customer/profile
 * Customer-only endpoint: Returns account profile, current balance, and recent activity
 */
const getCustomerProfileHandler = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Customer record not found.',
      });
    }

    const totalTransactions = await Payment.countDocuments({ userId: user._id });
    const recentPayments = await Payment.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    logSecurityEvent({
      eventType: 'ACCESS',
      action: 'CUSTOMER_PORTAL_ACCESSED',
      userEmail: user.email,
      ipAddress: ip,
      details: 'Customer profile loaded successfully.',
      severity: 'INFO',
    });

    res.status(200).json({
      success: true,
      data: {
        user: user.toSafeObject(),
        summary: {
          accountNumber: user.accountNumber,
          balance: user.balance,
          currency: 'INR (₹)',
          totalTransactions,
        },
        recentPayments,
      },
    });
  } catch (err) {
    console.error('Customer profile error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to load customer profile.',
    });
  }
};

router.get('/', requireAuth, getCustomerProfileHandler);
router.get('/profile', requireAuth, getCustomerProfileHandler);

module.exports = router;


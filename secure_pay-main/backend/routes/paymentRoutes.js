const express = require('express');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { validatePayment } = require('../middleware/validation');
const { logSecurityEvent } = require('../utils/logger');

const router = express.Router();

/**
 * GET /api/payments
 * Return demo payment transaction history
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const isUserAdmin = req.session.user.role === 'admin';
    
    // Admins can see all transactions; Customers only see their own
    const filter = isUserAdmin ? {} : { userId: req.session.user.id };
    
    const payments = await Payment.find(filter).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (err) {
    console.error('Payment history error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to retrieve payment history.',
    });
  }
});

/**
 * POST /api/payments
 * Create a dummy payment transaction
 * Enforces:
 * - Authentication
 * - Payload validation (amount, recipient, description)
 * - Balance validation
 * - Security event logging
 * - Zero collection of real card/CVV data
 */
router.post('/', requireAuth, validatePayment, async (req, res) => {
  try {
    const { amount, recipient, description } = req.body;
    const userId = req.session.user.id;
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User account not found.',
      });
    }

    // Check demo balance
    if (user.balance < amount) {
      logSecurityEvent({
        eventType: 'PAYMENT',
        action: 'PAYMENT_REJECTED_INSUFFICIENT_FUNDS',
        userEmail: user.email,
        ipAddress: ip,
        details: `Payment of ₹${amount} to '${recipient}' rejected: Insufficient balance (Current: ₹${user.balance})`,
        severity: 'WARNING',
      });

      return res.status(400).json({
        success: false,
        error: 'Insufficient Funds',
        message: `Insufficient balance for this payment. Available demo balance: ₹${user.balance}. Requested: ₹${amount}.`,
      });
    }

    // Deduct demo balance
    user.balance = Math.max(0, user.balance - amount);
    await user.save();

    // Create payment record
    const payment = new Payment({
      userId: user._id,
      userEmail: user.email,
      amount,
      recipient,
      description,
      status: 'SUCCESS',
    });

    await payment.save();

    logSecurityEvent({
      eventType: 'PAYMENT',
      action: 'PAYMENT_SUCCESS',
      userEmail: user.email,
      ipAddress: ip,
      details: `Demo payment of ₹${amount} to '${recipient}' created successfully. Transaction: ${payment.transactionId}`,
      severity: 'INFO',
    });

    res.status(201).json({
      success: true,
      message: `Payment of ₹${amount.toLocaleString()} to ${recipient} was processed successfully!`,
      data: payment,
      updatedBalance: user.balance,
    });
  } catch (err) {
    console.error('Payment creation error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to process payment.',
    });
  }
});

module.exports = router;

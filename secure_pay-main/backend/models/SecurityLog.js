const mongoose = require('mongoose');

/**
 * SecurityLog Schema
 * Demonstrates:
 * - Centralized audit logging for security monitoring
 * - Tracking authentication events, authorization rejections, payments, and system operations
 */
const securityLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    eventType: {
      type: String,
      enum: ['AUTH', 'SECURITY', 'PAYMENT', 'ACCESS', 'VALIDATION'],
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      default: 'anonymous',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    details: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['INFO', 'WARNING', 'CRITICAL'],
      default: 'INFO',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SecurityLog', securityLogSchema);

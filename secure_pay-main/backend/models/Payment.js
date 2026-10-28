const mongoose = require('mongoose');

/**
 * Payment Schema
 * Demonstrates:
 * - Basic payment data modeling
 * - Strictly NO storage of card numbers, CVVs, PINs, or sensitive banking credentials
 * - Transaction metadata for auditing
 */
const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      required: true,
      default: () => 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [1, 'Payment amount must be at least ₹1'],
      max: [100000, 'Payment amount exceeds demo maximum limit of ₹1,00,000'],
    },
    recipient: {
      type: String,
      required: [true, 'Recipient name/store is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Payment description is required'],
      trim: true,
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);

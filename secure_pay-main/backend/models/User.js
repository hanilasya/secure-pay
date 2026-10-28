const mongoose = require('mongoose');

/**
 * User Schema
 * Demonstrates:
 * - Secure password storage (Bcrypt hash)
 * - Role-Based Access Control (RBAC) role field ('customer' | 'admin')
 * - Account dummy details for demo purposes
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password hash is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
      required: true,
    },
    accountNumber: {
      type: String,
      default: () => 'ACC-' + Math.floor(10000000 + Math.random() * 90000000),
    },
    balance: {
      type: Number,
      default: 25000, // Demo account balance in INR
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Method to return user representation without sensitive fields (password hash)
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    accountNumber: this.accountNumber,
    balance: this.balance,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);

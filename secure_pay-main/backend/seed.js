const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Payment = require('./models/Payment');
const SecurityLog = require('./models/SecurityLog');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/securepay_db';

/**
 * Seed Database with Demo Accounts and Sample Data
 */
async function seedDatabase(isStandalone = false) {
  try {
    if (isStandalone) {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB for seeding...');
    }

    // Demo Users credentials
    const demoCustomerEmail = 'customer@securepay.test';
    const demoCustomerPass = 'Customer@123';

    const demoAdminEmail = 'admin@securepay.test';
    const demoAdminPass = 'Admin@123';

    // Check customer
    let customer = await User.findOne({ email: demoCustomerEmail });
    if (!customer) {
      const hashedCustomerPass = await bcrypt.hash(demoCustomerPass, 10);
      customer = new User({
        name: 'Alex Johnson (Customer)',
        email: demoCustomerEmail,
        password: hashedCustomerPass,
        role: 'customer',
        accountNumber: 'ACC-10029384',
        balance: 50000,
      });
      await customer.save();
      console.log(`[SEED] Created Customer Demo Account: ${demoCustomerEmail} (Password: ${demoCustomerPass})`);
    }

    // Check admin
    let admin = await User.findOne({ email: demoAdminEmail });
    if (!admin) {
      const hashedAdminPass = await bcrypt.hash(demoAdminPass, 10);
      admin = new User({
        name: 'Security Admin',
        email: demoAdminEmail,
        password: hashedAdminPass,
        role: 'admin',
        accountNumber: 'ADM-99001122',
        balance: 1000000,
      });
      await admin.save();
      console.log(`[SEED] Created Admin Demo Account: ${demoAdminEmail} (Password: ${demoAdminPass})`);
    }

    // Seed sample transactions if none exist
    const paymentCount = await Payment.countDocuments();
    if (paymentCount === 0 && customer) {
      const samplePayments = [
        {
          transactionId: 'TXN-INIT-101',
          userId: customer._id,
          userEmail: customer.email,
          amount: 1499,
          recipient: 'CloudSec Hosting Solutions',
          description: 'Monthly VPS and Firewall Subscription',
          status: 'SUCCESS',
        },
        {
          transactionId: 'TXN-INIT-102',
          userId: customer._id,
          userEmail: customer.email,
          amount: 3500,
          recipient: 'CyberSafe Tech Store',
          description: 'Hardware Security Key (FIDO2/U2F)',
          status: 'SUCCESS',
        },
      ];
      await Payment.insertMany(samplePayments);
      console.log('[SEED] Inserted sample initial payments.');
    }

    // Seed initial security logs if none exist
    const logCount = await SecurityLog.countDocuments();
    if (logCount === 0) {
      const initialLogs = [
        {
          eventType: 'SECURITY',
          action: 'SYSTEM_INITIALIZED',
          userEmail: 'system',
          ipAddress: '127.0.0.1',
          details: 'SecurePay Multi-Domain Payment Platform started with Bcrypt & Session RBAC enabled.',
          severity: 'INFO',
        },
        {
          eventType: 'AUTH',
          action: 'DEMO_ACCOUNTS_PROVISIONED',
          userEmail: 'system',
          ipAddress: '127.0.0.1',
          details: 'Customer and Admin demo accounts provisioned with salted password hashing.',
          severity: 'INFO',
        },
      ];
      await SecurityLog.insertMany(initialLogs);
      console.log('[SEED] Inserted initial security audit logs.');
    }

    console.log('✓ Database seeding check complete.');

    if (isStandalone) {
      await mongoose.disconnect();
      console.log('Database disconnected.');
      process.exit(0);
    }
  } catch (err) {
    console.error('Database seeding error:', err);
    if (isStandalone) {
      process.exit(1);
    }
  }
}

// If run directly via "node seed.js"
if (require.main === module) {
  seedDatabase(true);
}

module.exports = { seedDatabase };

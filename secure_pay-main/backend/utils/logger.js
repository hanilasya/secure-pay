const SecurityLog = require('../models/SecurityLog');

/**
 * Security Logging Helper
 * Prints formatted cybersecurity audit logs to console and stores them in database
 * 
 * Event Types:
 * - [AUTH]: Login, logout, registration, failed authentication
 * - [SECURITY]: Unauthorized access attempt, privilege escalation, suspicious actions
 * - [PAYMENT]: Payment processing, transaction creation
 * - [ACCESS]: Route/Domain access
 * - [VALIDATION]: Bad input payloads, schema validation errors
 */
async function logSecurityEvent({ eventType, action, userEmail = 'anonymous', ipAddress = '127.0.0.1', details, severity = 'INFO' }) {
  const timestamp = new Date().toISOString();
  
  // Console logging for real-time visibility during presentation
  const consolePrefix = `[${eventType}]`;
  const consoleMsg = `[${timestamp}] ${consolePrefix} ${action} | User: ${userEmail} | IP: ${ipAddress} | Details: ${details}`;
  
  if (severity === 'CRITICAL' || severity === 'WARNING') {
    console.warn('\x1b[33m%s\x1b[0m', consoleMsg);
  } else {
    console.log('\x1b[36m%s\x1b[0m', consoleMsg);
  }

  // Persist to database for Admin Portal monitoring
  try {
    const logEntry = new SecurityLog({
      eventType,
      action,
      userEmail,
      ipAddress,
      details,
      severity,
    });
    await logEntry.save();
    return logEntry;
  } catch (err) {
    console.error('Failed to write security log to database:', err.message);
  }
}

module.exports = {
  logSecurityEvent,
};

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  Server,
  UserCheck,
  AlertOctagon,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  FileText,
  Activity,
} from 'lucide-react';
import SecurityBadge from '../components/SecurityBadge';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Hero Section */}
      <section
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(9, 13, 22, 0.95) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          boxShadow: '0 20px 40px -15px rgba(0, 240, 255, 0.15)',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <SecurityBadge type="rbac" label="Cybersecurity Academic Prototype" />
          <SecurityBadge type="session" label="Active Session Architecture" />
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            letterSpacing: '-1px',
            marginBottom: '1rem',
            background: 'linear-gradient(to right, #ffffff, #00f0ff, #93c5fd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SecurePay Payment Gateway
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '1.15rem',
            maxWidth: '750px',
            margin: '0 auto 2rem',
            lineHeight: 1.7,
          }}
        >
          A modular cybersecurity prototype demonstrating defense-in-depth architecture,
          multi-domain application separation, bcrypt password security, session-based RBAC, and secure dummy payment workflows.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem' }}>
                  <ShieldCheck size={18} />
                  <span>Open Admin Portal</span>
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link to="/customer" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem' }}>
                  <UserCheck size={18} />
                  <span>Open Customer Dashboard</span>
                  <ArrowRight size={16} />
                </Link>
              )}
              <Link to="/payment" className="btn btn-outline-cyan" style={{ padding: '0.85rem 1.8rem' }}>
                <CreditCard size={18} />
                <span>Test Payment App</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
                <Lock size={18} />
                <span>Access Portals / Login</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href="http://localhost:5000/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1.8rem' }}
              >
                <Server size={18} />
                <span>Backend Status API</span>
              </a>
            </>
          )}
        </div>
      </section>

      {/* Applications & Portals Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Isolated Multi-Domain Portals</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Each component represents a segregated security domain with distinct authorization controls.
          </p>
        </div>

        <div className="grid-4">
          {/* Main Website Card */}
          <div className="card card-interactive" style={{ borderTop: '3px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="domain-badge public">Public Domain</span>
              <span className="status-pill success">Live</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>1. Main Website</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Public landing page introducing company capabilities, platform architecture, and security protocols.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Route: / (Public)
            </div>
            <Link to="/" className="btn btn-secondary btn-sm btn-block">
              Current Page
            </Link>
          </div>

          {/* Customer Portal Card */}
          <div className="card card-interactive" style={{ borderTop: '3px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="domain-badge customer">Customer Domain</span>
              <span className="status-pill info">Auth Required</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>2. Customer Portal</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Customer account center for viewing session status, dummy balance, and past payment transactions.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Route: /customer (RBAC: Customer)
            </div>
            <Link to="/customer" className="btn btn-outline-cyan btn-sm btn-block">
              Open Customer Portal
            </Link>
          </div>

          {/* Payment Application Card */}
          <div className="card card-interactive" style={{ borderTop: '3px solid #00f0ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="domain-badge customer">Payment Domain</span>
              <span className="status-pill info">Auth Required</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>3. Payment App</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Simulated payment interface with strict input validation. Never requests or stores real card/banking data.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Route: /payment (RBAC: User)
            </div>
            <Link to="/payment" className="btn btn-outline-cyan btn-sm btn-block">
              Open Payment App
            </Link>
          </div>

          {/* Admin Portal Card */}
          <div className="card card-interactive" style={{ borderTop: '3px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="domain-badge admin">Admin Domain</span>
              <span className="status-pill failed">Admin Only</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>4. Admin Portal</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Security Operations Center (SOC) dashboard. Monitors system metrics, users, failed logins, and audit logs.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Route: /admin (RBAC: Admin)
            </div>
            <Link to="/admin" className="btn btn-danger btn-sm btn-block">
              Open Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Security Features Matrix (Cybersecurity Demonstration) */}
      <section className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
            <ShieldCheck size={20} />
            <span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontWeight: 600 }}>
              Cybersecurity Architecture
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Demonstrated Security Features</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            Comprehensive overview of the cybersecurity mechanisms implemented across the frontend and backend stack.
          </p>
        </div>

        <div className="grid-2">
          {/* Feature 1 */}
          <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ color: 'var(--accent-cyan)', flexShrink: 0 }}><Lock size={24} /></div>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>1. Bcrypt Password Hashing</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Passwords are never stored in plaintext. They are salted and hashed using <code>bcryptjs</code> (10 rounds) during registration and seed provisioning.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ color: 'var(--accent-green)', flexShrink: 0 }}><Key size={24} /></div>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>2. Session-Based Authentication</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Utilizes <code>express-session</code> with <code>httpOnly</code> cookies and session regeneration on login to eliminate session fixation and XSS cookie hijacking.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ color: 'var(--accent-amber)', flexShrink: 0 }}><UserCheck size={24} /></div>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>3. Role-Based Access Control (RBAC)</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Strict backend middleware (<code>requireAuth</code>, <code>requireAdmin</code>) verifies user roles. Customer accounts attempting to query <code>/api/admin/*</code> receive HTTP 403 Forbidden.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ color: 'var(--accent-purple)', flexShrink: 0 }}><CheckCircle2 size={24} /></div>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>4. Server-Side Input Validation</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                All endpoints rigorously sanitize and validate emails, passwords, and payment amounts (preventing negative values, NaN, and buffer overruns).
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ color: 'var(--accent-blue)', flexShrink: 0 }}><Server size={24} /></div>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>5. API Security & Rate Limiting</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Restricted CORS with allowed origin (<code>http://localhost:5173</code>), payload size limits (10kb), and rate limiting to defend against brute-force login attempts.
              </p>
            </div>
          </div>

          {/* Feature 6 */}
          <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ color: 'var(--accent-red)', flexShrink: 0 }}><Activity size={24} /></div>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>6. Security Logging & Monitoring</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                All authentication events, failed logins, unauthorized access attempts, and payments are logged with IP addresses, timestamps, and severity levels.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

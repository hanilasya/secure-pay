import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { ShieldAlert, ArrowLeft, Lock, UserCheck, ShieldCheck } from 'lucide-react';
import SecurityBadge from '../components/SecurityBadge';

export default function UnauthorizedPage() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const attemptedPath = location.state?.attemptedPath || '/admin';
  const requiredRole = location.state?.requiredRole || 'admin';
  const currentRole = location.state?.currentRole || (user ? user.role : 'unauthenticated');

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto' }}>
      <div
        className="card"
        style={{
          border: '1px solid rgba(239, 68, 68, 0.4)',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
          boxShadow: '0 20px 40px -15px rgba(239, 68, 68, 0.2)',
          padding: '2.5rem',
          textAlign: 'center',
        }}
      >
        {/* Warning Shield Icon */}
        <div
          style={{
            width: '68px',
            height: '68px',
            background: 'rgba(239, 68, 68, 0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: 'var(--accent-red)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
          }}
        >
          <ShieldAlert size={36} />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="domain-badge admin">RBAC Authorization Failure</span>
          <span className="status-pill failed">HTTP 403 Forbidden</span>
        </div>

        <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>
          Access Denied / Unauthorized
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          You do not possess the administrative privileges required to access the requested resource.
          Access has been blocked by Role-Based Access Control (RBAC) middleware.
        </p>

        {/* Security Audit Details Card */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '1.75rem',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ fontWeight: 600, color: '#f87171', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Lock size={15} />
            <span>Cybersecurity Enforcement Details:</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block' }}>Attempted Resource:</span>
              <span className="mono-text" style={{ color: '#fff' }}>{attemptedPath}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block' }}>Required Role:</span>
              <span className="status-pill failed">{requiredRole.toUpperCase()}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block' }}>Authenticated User:</span>
              <span style={{ color: '#cbd5e1' }}>{user?.email || 'Not Authenticated'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block' }}>Current User Role:</span>
              <span className={`status-pill ${currentRole === 'admin' ? 'failed' : 'info'}`}>
                {currentRole.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            🔒 <strong>Audit Trail:</strong> This unauthorized access attempt was logged to the security audit stream with event type <code style={{ color: '#f87171' }}>UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT</code>.
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {isAuthenticated && user?.role === 'customer' ? (
            <Link to="/customer" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <UserCheck size={16} />
              <span>Return to Customer Portal</span>
            </Link>
          ) : (
            <Link to="/" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
              <ArrowLeft size={16} />
              <span>Return to Main Website</span>
            </Link>
          )}

          <Link to="/login" className="btn btn-outline-cyan" style={{ padding: '0.75rem 1.5rem' }}>
            <ShieldCheck size={16} />
            <span>Switch to Admin Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

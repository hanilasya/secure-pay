import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck, Key } from 'lucide-react';
import AlertBanner from '../components/AlertBanner';
import SecurityBadge from '../components/SecurityBadge';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle demo autofill helper buttons (for quick college presentation)
  const handleQuickFill = (role) => {
    if (role === 'customer') {
      setEmail('customer@securepay.test');
      setPassword('Customer@123');
    } else if (role === 'admin') {
      setEmail('admin@securepay.test');
      setPassword('Admin@123');
    }
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Client-side pre-validation
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      
      // Redirect based on role or intended destination
      if (result.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const fromPath = location.state?.from?.pathname;
        navigate(fromPath && fromPath !== '/login' ? fromPath : '/customer', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'rgba(0, 240, 255, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
            }}
          >
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>Secure Portal Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Multi-Domain Authentication Gateway
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <AlertBanner
            type="error"
            title="Authentication Error"
            message={errorMsg}
            onClose={() => setErrorMsg('')}
          />
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email Field */}
          <div>
            <label
              htmlFor="login-email"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                placeholder="e.g. user@securepay.test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
                autoComplete="email"
              />
              <Mail
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="login-password"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                autoComplete="current-password"
              />
              <Key
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  color: 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
            style={{ marginTop: '0.5rem', padding: '0.8rem' }}
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick-Fill Helper Section (College Presentation Tool) */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <ShieldCheck size={14} color="#00f0ff" />
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
              Demo Presentation Quick-Fill
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              id="fill-customer-btn"
              onClick={() => handleQuickFill('customer')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.8rem', justifyContent: 'center' }}
            >
              <UserCheck size={14} color="#34d399" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              id="fill-admin-btn"
              onClick={() => handleQuickFill('admin')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.8rem', justifyContent: 'center' }}
            >
              <ShieldCheck size={14} color="#f87171" />
              <span>Admin Demo</span>
            </button>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.5rem', textAlign: 'center' }}>
            Auto-fills verified test credentials seeded in the backend.
          </div>
        </div>
      </div>
    </div>
  );
}

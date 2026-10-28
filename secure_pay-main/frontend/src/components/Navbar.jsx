import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import {
  Shield,
  CreditCard,
  User,
  LayoutDashboard,
  LogOut,
  LogIn,
  Home,
  ShieldAlert,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Determine current simulated domain based on URL path
  const getDomainInfo = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) {
      return { label: 'Admin Portal (admin.securepay.example)', type: 'admin' };
    }
    if (path.startsWith('/customer')) {
      return { label: 'Customer Portal (customer.securepay.example)', type: 'customer' };
    }
    if (path.startsWith('/payment')) {
      return { label: 'Payment App (pay.securepay.example)', type: 'customer' };
    }
    if (path.startsWith('/login')) {
      return { label: 'Auth Gateway (auth.securepay.example)', type: 'public' };
    }
    return { label: 'Main Website (www.securepay.example)', type: 'public' };
  };

  const domain = getDomainInfo();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand & Simulated Domain Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/" className="navbar-brand">
            <Shield className="brand-icon" size={26} />
            <span>SecurePay</span>
          </Link>
          <div className={`domain-badge ${domain.type}`}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
            {domain.label}
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Home size={16} />
              <span>Main Website</span>
            </Link>
          </li>
          <li>
            <Link
              to="/customer"
              className={`nav-link ${location.pathname === '/customer' ? 'active' : ''}`}
            >
              <User size={16} />
              <span>Customer Portal</span>
            </Link>
          </li>
          <li>
            <Link
              to="/payment"
              className={`nav-link ${location.pathname === '/payment' ? 'active' : ''}`}
            >
              <CreditCard size={16} />
              <span>Payment App</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <LayoutDashboard size={16} />
              <span>Admin Portal</span>
            </Link>
          </li>
        </ul>

        {/* Auth State & Action Buttons */}
        <div className="nav-auth-section">
          {isAuthenticated ? (
            <>
              <div className="user-badge">
                <span style={{ color: '#fff', fontWeight: 500 }}>{user.name}</span>
                <span className={`user-role-tag ${user.role}`}>{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
                title="Log out and destroy session"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <LogIn size={15} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { customerAPI, paymentAPI } from '../services/api';
import {
  User,
  CreditCard,
  Wallet,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Key,
  LogOut,
  RefreshCw,
  PlusCircle,
  FileCheck2,
} from 'lucide-react';
import SecurityBadge from '../components/SecurityBadge';
import AlertBanner from '../components/AlertBanner';

export default function CustomerDashboard() {
  const { user, sessionId, logout, updateUserBalance } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, paymentsRes] = await Promise.all([
        customerAPI.getProfile(),
        paymentAPI.getPayments(),
      ]);

      if (profileRes.data?.success) {
        setProfileData(profileRes.data.data);
        if (profileRes.data.data.summary?.balance !== undefined) {
          updateUserBalance(profileRes.data.data.summary.balance);
        }
      }

      if (paymentsRes.data?.success) {
        setTransactions(paymentsRes.data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load customer dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const balance = profileData?.summary?.balance ?? user?.balance ?? 0;
  const accountNumber = profileData?.summary?.accountNumber || user?.accountNumber || 'ACC-XXXXXXXX';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner with Active Domain & Session Status */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '1.75rem 2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="domain-badge customer">Customer Portal Domain</span>
              <SecurityBadge type="session" label="Active Session" />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Welcome, {user?.name || 'Customer'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Logged in as: <span style={{ color: '#fff' }}>{user?.email}</span>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={loadDashboardData}
              className="btn btn-secondary btn-sm"
              title="Refresh account data"
            >
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
            <Link to="/payment" className="btn btn-primary btn-sm" id="customer-make-payment-btn">
              <PlusCircle size={15} />
              <span>Make Payment</span>
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm"
              title="End session"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <AlertBanner
          type="error"
          title="Dashboard Error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* Account Info Cards */}
      <div className="grid-3">
        {/* Balance Card */}
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <Wallet size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Available Demo Balance</span>
            <span className="stat-value" style={{ color: '#34d399' }}>
              ₹{balance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Account Number Card */}
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <CreditCard size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Demo Account Number</span>
            <span className="stat-value" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              {accountNumber}
            </span>
          </div>
        </div>

        {/* Session Security Card */}
        <div className="stat-card">
          <div className="stat-icon-wrapper cyan">
            <Key size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Session ID (Cookie)</span>
            <span
              className="stat-value"
              style={{
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-cyan)',
                wordBreak: 'break-all',
              }}
            >
              {sessionId ? `${sessionId.substring(0, 16)}...` : 'Active / HttpOnly'}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Action Quick Section */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', background: 'rgba(30, 41, 59, 0.4)' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} color="#00f0ff" />
            <span>Ready to make a test payment?</span>
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Navigate to the Payment Application domain to perform dummy transactions with server-side validation.
          </p>
        </div>
        <Link to="/payment" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <span>Open Payment Application</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Recent Transactions Section */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Clock size={20} color="#60a5fa" />
            <span>Recent Payment Transactions</span>
          </div>
          <span className="status-pill info">{transactions.length} Records</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Loading transaction history...
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <FileCheck2 size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
            <p>No transactions yet.</p>
            <Link to="/payment" className="btn btn-outline-cyan btn-sm" style={{ marginTop: '1rem' }}>
              Create First Test Payment
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Recipient / Store</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id || tx.transactionId}>
                    <td className="mono-text" style={{ color: 'var(--accent-cyan)' }}>
                      {tx.transactionId}
                    </td>
                    <td style={{ fontWeight: 600 }}>{tx.recipient}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{tx.description}</td>
                    <td style={{ fontWeight: 700, color: '#34d399' }}>
                      ₹{tx.amount?.toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-pill ${tx.status === 'SUCCESS' ? 'success' : 'failed'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

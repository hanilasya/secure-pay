import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { adminAPI } from '../services/api';
import {
  ShieldAlert,
  Users,
  CreditCard,
  Activity,
  Lock,
  Server,
  RefreshCw,
  LogOut,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import SecurityBadge from '../components/SecurityBadge';
import AlertBanner from '../components/AlertBanner';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeTab, setActiveTab] = useState('logs'); // 'logs' | 'users' | 'metrics'
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, logsRes, usersRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getLogs({
          severity: selectedSeverity || undefined,
          eventType: selectedEventType || undefined,
        }),
        adminAPI.getUsers(),
      ]);

      if (dashRes.data?.success) {
        setDashboardData(dashRes.data.data);
      }
      if (logsRes.data?.success) {
        setLogs(logsRes.data.data);
      }
      if (usersRes.data?.success) {
        setUsersList(usersRes.data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch admin security dashboard telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [selectedSeverity, selectedEventType]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const metrics = dashboardData?.metrics || {};
  const systemStatus = dashboardData?.systemStatus || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Admin Top Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          padding: '1.75rem 2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="domain-badge admin">Admin Domain (SOC)</span>
              <SecurityBadge type="rbac" label="Admin Superuser Session" />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
              Security Operations Center (SOC)
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Logged in Administrator: <span style={{ color: '#fff', fontWeight: 600 }}>{user?.email}</span>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={fetchAdminData}
              className="btn btn-secondary btn-sm"
              title="Refresh telemetry"
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm"
              title="End admin session"
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
          title="Admin Telemetry Error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* Cybersecurity Telemetry Cards Grid */}
      <div className="grid-4">
        {/* Total Users */}
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Registered Accounts</span>
            <span className="stat-value">{metrics.totalUsers ?? 0}</span>
          </div>
        </div>

        {/* Total Volume */}
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CreditCard size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Demo Payment Volume</span>
            <span className="stat-value" style={{ color: '#34d399' }}>
              ₹{(metrics.totalVolume || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Failed Logins */}
        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Lock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Failed Logins</span>
            <span className="stat-value" style={{ color: '#fbbf24' }}>
              {metrics.failedLogins ?? 0}
            </span>
          </div>
        </div>

        {/* Unauthorized Access Attempts */}
        <div className="stat-card">
          <div className="stat-icon-wrapper red">
            <ShieldAlert size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">RBAC Violations</span>
            <span className="stat-value" style={{ color: '#f87171' }}>
              {metrics.unauthorizedAccessAttempts ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* System Security Status Overview */}
      <div className="card" style={{ padding: '1.25rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Server size={18} color="#00f0ff" />
            <strong style={{ fontSize: '0.95rem' }}>Active Security Controls:</strong>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <SecurityBadge type="bcrypt" label="Bcrypt Hashing (Salt: 10)" />
            <SecurityBadge type="session" label="HttpOnly Session Storage" />
            <SecurityBadge type="rbac" label="Role-Based Access Control" />
            <SecurityBadge type="api" label="IP Rate Limiting & Strict CORS" />
          </div>
        </div>
      </div>

      {/* Main Tab Controls & Content Section */}
      <div className="card" style={{ padding: '1.75rem' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('logs')}
              className={`btn btn-sm ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Activity size={15} />
              <span>Security Audit Logs ({logs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Users size={15} />
              <span>User Accounts ({usersList.length})</span>
            </button>
          </div>

          {/* Log Filters */}
          {activeTab === 'logs' && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Filter size={14} color="var(--text-dim)" />
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
              >
                <option value="">All Event Types</option>
                <option value="AUTH">AUTH</option>
                <option value="SECURITY">SECURITY</option>
                <option value="PAYMENT">PAYMENT</option>
                <option value="ACCESS">ACCESS</option>
                <option value="VALIDATION">VALIDATION</option>
              </select>

              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
              >
                <option value="">All Severities</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: Security Audit Logs */}
        {activeTab === 'logs' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Loading security logs...
              </div>
            ) : logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                No security audit logs found matching the filter criteria.
              </div>
            ) : (
              <div className="table-container">
                <table className="cyber-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Severity</th>
                      <th>Event Type</th>
                      <th>Action</th>
                      <th>User Account</th>
                      <th>IP Address</th>
                      <th>Event Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => {
                      const severityClass =
                        log.severity === 'CRITICAL'
                          ? 'failed'
                          : log.severity === 'WARNING'
                          ? 'warning'
                          : 'info';

                      return (
                        <tr key={log._id}>
                          <td style={{ color: 'var(--text-dim)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td>
                            <span className={`status-pill ${severityClass}`}>{log.severity}</span>
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                            {log.eventType}
                          </td>
                          <td className="mono-text" style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                            {log.action}
                          </td>
                          <td style={{ color: log.userEmail === 'admin@securepay.test' ? '#f87171' : '#cbd5e1' }}>
                            {log.userEmail}
                          </td>
                          <td className="mono-text" style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            {log.ipAddress}
                          </td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                            {log.details}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: User Accounts */}
        {activeTab === 'users' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Loading user directory...
              </div>
            ) : (
              <div className="table-container">
                <table className="cyber-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Account Number</th>
                      <th>Demo Balance</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td style={{ color: 'var(--accent-cyan)' }}>{u.email}</td>
                        <td>
                          <span className={`user-role-tag ${u.role}`}>{u.role}</span>
                        </td>
                        <td className="mono-text">{u.accountNumber}</td>
                        <td style={{ fontWeight: 600, color: '#34d399' }}>
                          ₹{u.balance?.toLocaleString()}
                        </td>
                        <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

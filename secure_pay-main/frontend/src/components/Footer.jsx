import React from 'react';
import { ShieldCheck, Server, Globe, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand" style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={20} color="#00f0ff" />
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>SecurePay Architecture</h4>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              College Cybersecurity Project Prototype demonstrating secure multi-application isolation,
              Role-Based Access Control (RBAC), bcrypt salted hashing, session management, and dummy payment processing.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.5rem' }}>
              Simulated Multi-Domain Topology
            </h5>
            <div className="domain-sim-table">
              <span className="domain-sim-item">
                <Globe size={12} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#60a5fa' }} />
                www.securepay.example (Public)
              </span>
              <span className="domain-sim-item">
                <Lock size={12} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#34d399' }} />
                customer.securepay.example (Customer)
              </span>
              <span className="domain-sim-item">
                <Lock size={12} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#00f0ff' }} />
                pay.securepay.example (Payment)
              </span>
              <span className="domain-sim-item">
                <ShieldCheck size={12} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#f87171' }} />
                admin.securepay.example (Admin)
              </span>
              <span className="domain-sim-item">
                <Server size={12} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#a78bfa' }} />
                api.securepay.example (REST API)
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            ⚠️ <strong>Security Notice:</strong> Educational demonstration only. All payment amounts, balances, and accounts are dummy test records.
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Express.js + MongoDB + React + Vite
          </div>
        </div>
      </div>
    </footer>
  );
}

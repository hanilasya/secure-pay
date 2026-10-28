import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { paymentAPI } from '../services/api';
import {
  CreditCard,
  Send,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Building,
  FileText,
  IndianRupee,
  CheckCircle2,
} from 'lucide-react';
import AlertBanner from '../components/AlertBanner';
import SecurityBadge from '../components/SecurityBadge';

export default function PaymentPage() {
  const { user, updateUserBalance } = useAuth();
  const [amount, setAmount] = useState('500');
  const [recipient, setRecipient] = useState('CyberSafe Tech Store');
  const [description, setDescription] = useState('Hardware Security Key (Demo Order)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '', title: '' });
  const [lastTransaction, setLastTransaction] = useState(null);

  const navigate = useNavigate();

  const handleQuickTemplate = (tempAmount, tempRecipient, tempDesc) => {
    setAmount(tempAmount);
    setRecipient(tempRecipient);
    setDescription(tempDesc);
    setFeedback({ type: '', message: '', title: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '', title: '' });
    setLastTransaction(null);

    // Client-side validation checks
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setFeedback({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a valid positive payment amount greater than ₹0.',
      });
      return;
    }

    if (!recipient.trim()) {
      setFeedback({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide a recipient name or merchant.',
      });
      return;
    }

    if (!description.trim()) {
      setFeedback({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide a payment description.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await paymentAPI.createPayment(numAmount, recipient.trim(), description.trim());
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          title: 'Payment Processed Successfully!',
          message: res.data.message || `Demo transaction created.`,
        });
        setLastTransaction(res.data.data);
        if (res.data.updatedBalance !== undefined) {
          updateUserBalance(res.data.updatedBalance);
        }
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Payment Failed',
        message: err.message || 'Payment processing failed. Check server logs.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '1rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/customer" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        <span className="domain-badge customer">Payment Application Domain</span>
      </div>

      {/* Security Caution Notice */}
      <div
        className="card"
        style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <AlertTriangle size={22} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#fbbf24', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
              Academic Prototype — Strict Zero-Sensitive-Data Policy
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              This is a simulated payment gateway. <strong>DO NOT</strong> enter real credit card numbers, CVVs, ATM PINs, UPI PINs, or banking passwords. All transactions operate on virtual demo balances.
            </p>
          </div>
        </div>
      </div>

      {/* Main Payment Form Card */}
      <div className="card" style={{ padding: '2.25rem' }}>
        <div className="card-header" style={{ marginBottom: '1.5rem' }}>
          <div className="card-title">
            <CreditCard size={22} color="#00f0ff" />
            <span>Make Demo Payment</span>
          </div>
          <SecurityBadge type="api" label="Server-Side Validated" />
        </div>

        {feedback.message && (
          <AlertBanner
            type={feedback.type}
            title={feedback.title}
            message={feedback.message}
            onClose={() => setFeedback({ type: '', message: '', title: '' })}
          />
        )}

        {/* Successful Transaction Receipt Card */}
        {lastTransaction && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 600, marginBottom: '0.5rem' }}>
              <CheckCircle2 size={18} />
              <span>Transaction Receipt</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block' }}>Transaction ID:</span>
                <span className="mono-text" style={{ color: 'var(--accent-cyan)' }}>{lastTransaction.transactionId}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block' }}>Amount Paid:</span>
                <strong style={{ color: '#fff' }}>₹{lastTransaction.amount?.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block' }}>Recipient:</span>
                <span>{lastTransaction.recipient}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block' }}>Status:</span>
                <span className="status-pill success">{lastTransaction.status}</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Payment Amount */}
          <div>
            <label
              htmlFor="payment-amount"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}
            >
              Payment Amount (INR ₹)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="payment-amount"
                type="number"
                step="0.01"
                min="1"
                max="100000"
                placeholder="e.g. 500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem', fontSize: '1.1rem', fontWeight: 600 }}
              />
              <IndianRupee
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
              Valid range: ₹1 to ₹1,00,000 | Current Demo Balance: ₹{user?.balance?.toLocaleString() || '0'}
            </div>
          </div>

          {/* Recipient / Merchant */}
          <div>
            <label
              htmlFor="payment-recipient"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}
            >
              Recipient / Merchant Store
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="payment-recipient"
                type="text"
                placeholder="e.g. Demo Store, Secure Cloud Host"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
                maxLength={100}
              />
              <Building
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="payment-desc"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}
            >
              Payment Description
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="payment-desc"
                type="text"
                placeholder="e.g. Subscription payment, Book purchase"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
                maxLength={200}
              />
              <FileText
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              />
            </div>
          </div>

          {/* Quick Demo Templates */}
          <div>
            <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Quick Demo Templates:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickTemplate('299', 'SecureVPN Pro', '1-Month VPN Subscription')}
              >
                ₹299 (VPN Sub)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickTemplate('1200', 'CloudSec Hosting', 'Domain & SSL Renewal')}
              >
                ₹1,200 (Hosting)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickTemplate('4500', 'Cyber Academy', 'Ethical Hacking Course')}
              >
                ₹4,500 (Course)
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="submit-payment-btn"
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
            style={{ marginTop: '0.75rem', padding: '0.85rem' }}
          >
            {isSubmitting ? (
              <span>Processing Demo Transaction...</span>
            ) : (
              <>
                <Send size={16} />
                <span>Confirm & Process Payment</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function AlertBanner({ type = 'info', message, title, onClose }) {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="#34d399" />;
      case 'error':
        return <AlertCircle size={20} color="#f87171" />;
      case 'warning':
        return <AlertTriangle size={20} color="#fbbf24" />;
      case 'info':
      default:
        return <Info size={20} color="#00f0ff" />;
    }
  };

  return (
    <div className={`alert-banner ${type}`}>
      <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        {title && <strong style={{ display: 'block', marginBottom: '0.2rem' }}>{title}</strong>}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'transparent', color: 'inherit', padding: '2px' }}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

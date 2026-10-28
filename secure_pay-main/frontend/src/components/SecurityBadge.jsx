import React from 'react';
import { ShieldCheck, Lock, Key, Server, CheckCircle2 } from 'lucide-react';

export default function SecurityBadge({ type = 'rbac', label }) {
  const getBadgeConfig = () => {
    switch (type) {
      case 'bcrypt':
        return {
          icon: <Lock size={13} />,
          text: label || 'Bcrypt (Salt: 10)',
          className: 'info',
        };
      case 'session':
        return {
          icon: <Key size={13} />,
          text: label || 'Session Cookie (HttpOnly)',
          className: 'success',
        };
      case 'rbac':
        return {
          icon: <ShieldCheck size={13} />,
          text: label || 'RBAC Protected',
          className: 'warning',
        };
      case 'api':
        return {
          icon: <Server size={13} />,
          text: label || 'CORS & Rate Limited',
          className: 'info',
        };
      default:
        return {
          icon: <CheckCircle2 size={13} />,
          text: label || 'Security Verified',
          className: 'success',
        };
    }
  };

  const { icon, text, className } = getBadgeConfig();

  return (
    <span className={`status-pill ${className}`}>
      {icon}
      <span>{text}</span>
    </span>
  );
}

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import PaymentPage from './pages/PaymentPage';
import AdminDashboard from './pages/AdminDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';

export default function App() {
  return (
    <div className="app-container">
      {/* Dynamic Navigation Bar with Domain Indicators */}
      <Navbar />

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          {/* 1. Main Website Route */}
          <Route path="/" element={<HomePage />} />

          {/* 2. Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* 3. Customer Portal Route (Protected) */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* 4. Payment Application Route (Protected) */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          {/* 5. Admin Portal Route (Protected - Requires Admin Role) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 6. Unauthorized Page Route */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Fallback Catch-All Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer with Topology Information */}
      <Footer />
    </div>
  );
}

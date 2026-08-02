import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { RegistrationPage } from './pages/RegistrationPage';
import { EmailVerificationPage } from './pages/EmailVerificationPage';
import { LoginPage } from './pages/LoginPage';
import { CandidateDashboardPage } from './pages/CandidateDashboardPage';
import { SynopsisSubmissionPage } from './pages/SynopsisSubmissionPage';
import { MainHackathonPage } from './pages/MainHackathonPage';
import { ResultsPage } from './pages/ResultsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Default Landing Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Public Auth Flow */}
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/verify" element={<EmailVerificationPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Candidate Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <CandidateDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/synopsis"
                  element={
                    <ProtectedRoute>
                      <SynopsisSubmissionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hackathon"
                  element={
                    <ProtectedRoute requireShortlist>
                      <MainHackathonPage />
                    </ProtectedRoute>
                  }
                />

                {/* Public Leaderboard */}
                <Route path="/results" element={<ResultsPage />} />

                {/* Admin Management Panel */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminPanelPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback Catch-All */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

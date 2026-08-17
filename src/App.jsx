import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Candidate Pages
import { LandingPage } from './pages/LandingPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { LoginPage } from './pages/LoginPage';
import { SynopsisSubmissionPage } from './pages/SynopsisSubmissionPage';
import { MainHackathonPage } from './pages/MainHackathonPage';
import { ResultsPage } from './pages/ResultsPage';

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-orange-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Candidate Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/results" element={<ResultsPage />} />

                {/* Candidate Protected Routes */}
                <Route
                  path="/synopsis"
                  element={
                    <ProtectedRoute>
                      <SynopsisSubmissionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/synopsis-submission"
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
                <Route
                  path="/hackathon-submission"
                  element={
                    <ProtectedRoute requireShortlist>
                      <MainHackathonPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback Catch-All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

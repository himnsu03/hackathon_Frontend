import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { EmailVerificationPage } from './pages/EmailVerificationPage';
import { LoginPage } from './pages/LoginPage';
import { CandidateDashboardPage } from './pages/CandidateDashboardPage';
import { SynopsisSubmissionPage } from './pages/SynopsisSubmissionPage';
import { MainHackathonPage } from './pages/MainHackathonPage';
import { ResultsPage } from './pages/ResultsPage';

// Admin Pages
import { AdminPanelPage } from './pages/AdminPanelPage';
import { AdminConfigPage } from './pages/AdminConfigPage';
import { AdminProblemStatementsPage } from './pages/AdminProblemStatementsPage';
import { AdminEvaluatorsPage } from './pages/AdminEvaluatorsPage';
import { AdminSynopsisDetailPage } from './pages/AdminSynopsisDetailPage';
import { AdminHackathonDetailPage } from './pages/AdminHackathonDetailPage';

// Evaluator Pages
import { EvaluatorSynopsisListPage } from './pages/EvaluatorSynopsisListPage';
import { EvaluatorSynopsisDetailPage } from './pages/EvaluatorSynopsisDetailPage';
import { EvaluatorHackathonListPage } from './pages/EvaluatorHackathonListPage';
import { EvaluatorHackathonDetailPage } from './pages/EvaluatorHackathonDetailPage';
import { EvaluatorInterviewListPage } from './pages/EvaluatorInterviewListPage';
import { EvaluatorInterviewDetailPage } from './pages/EvaluatorInterviewDetailPage';

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-orange-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

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

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminPanelPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/config"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminConfigPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/problem-statements"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminProblemStatementsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/evaluators"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminEvaluatorsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/synopsis/:id"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminSynopsisDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/hackathon-submissions/:id"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminHackathonDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Evaluator Portal Protected Routes */}
                <Route
                  path="/evaluator/synopsis"
                  element={
                    <ProtectedRoute requiredRole="evaluator">
                      <EvaluatorSynopsisListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/evaluator/synopsis/:id"
                  element={
                    <ProtectedRoute requiredRole="evaluator">
                      <EvaluatorSynopsisDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/evaluator/hackathon"
                  element={
                    <ProtectedRoute requiredRole="evaluator">
                      <EvaluatorHackathonListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/evaluator/hackathon-submissions/:id"
                  element={
                    <ProtectedRoute requiredRole="evaluator">
                      <EvaluatorHackathonDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/evaluator/interview"
                  element={
                    <ProtectedRoute requiredRole="evaluator">
                      <EvaluatorInterviewListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/evaluator/interview/:id"
                  element={
                    <ProtectedRoute requiredRole="evaluator">
                      <EvaluatorInterviewDetailPage />
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

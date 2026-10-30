import React from 'react';
import { Routes, Route, Navigate, BrowserRouter, useLocation } from 'react-router-dom';
import { useProgress } from './contexts/ProgressContext';
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';

import Home from './pages/Home';
import Learn from './pages/Learn';
import Dashboard from './pages/Dashboard';
import Pathways from './pages/Pathways';
import Projects from './pages/Projects';
import InstructorStudio from './pages/InstructorStudio';
import ClimateData from './pages/ClimateData';
import CaseStudies from './pages/CaseStudies';
import ImpactTracker from './pages/ImpactTracker';
import VerifyCertificate from './pages/VerifyCertificate';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import About from './pages/About';
import Help from './pages/Help';
import Glossary from './pages/Glossary';
import Scenarios from './pages/Scenarios';
import ActionGuides from './pages/ActionGuides';
import Buddy from './pages/Buddy';
import Awareness from './pages/Awareness';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import LessonView from './components/LessonView';
import AssessmentView from './components/AssessmentView';
import Onboarding from './components/Onboarding';
import { GuestTransferModal } from './components/GuestTransferModal';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { settings, isLoading } = useProgress();
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-bg">
        <div className="w-8 h-8 border-4 border-forest-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Protected pages strictly enforce authentic account session
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!settings?.onboardingComplete) {
    return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <>
      <GuestTransferModal />
      <Routes>
        {/* Public authentication and verification */}
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/verify/:certId" element={<VerifyCertificate />} />

        {/* Protected Hub with Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {/* Primary Learner Dashboard & Course Hub */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/progress" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/pathways" element={<Pathways />} />
          <Route path="/projects" element={<Projects />} />

          {/* Institutional & Staff Workflows */}
          <Route path="/instructor" element={<InstructorStudio />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Climate Differentiators */}
          <Route path="/climate-data" element={<ClimateData />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/impact" element={<ImpactTracker />} />

          {/* Existing Resources & Awareness */}
          <Route path="/resources" element={<Resources />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/action-guides" element={<ActionGuides />} />
          <Route path="/buddy" element={<Buddy />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          
          {/* Advanced Course Player */}
          <Route path="/module/:moduleId" element={<LessonView />} />
          
          {/* Evaluation Assessment Route */}
          <Route path="/assessment" element={<AssessmentView />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

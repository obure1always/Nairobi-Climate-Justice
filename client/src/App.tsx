import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { useProgress } from './contexts/ProgressContext';
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';

import Home from './pages/Home';
import Learn from './pages/Learn';
import Progress from './pages/Progress';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import About from './pages/About';
import Help from './pages/Help';
import Glossary from './pages/Glossary';
import Scenarios from './pages/Scenarios';
import ActionGuides from './pages/ActionGuides';
import Buddy from './pages/Buddy';
import Login from './pages/Login';
import LessonView from './components/LessonView';
import AssessmentView from './components/AssessmentView';
import Onboarding from './components/Onboarding';
import { GuestTransferModal } from './components/GuestTransferModal';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { settings, isLoading } = useProgress();
  const { user, isGuest, isLoading: authLoading } = useAuth();

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-bg">
        <div className="w-8 h-8 border-4 border-forest-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Learner can continue if logged in OR in guest mode
  if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  if (!settings?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <>
      <GuestTransferModal />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/action-guides" element={<ActionGuides />} />
          <Route path="/buddy" element={<Buddy />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          
          {/* Module Flow Routes */}
          <Route path="/module/:moduleId" element={<LessonView />} />
          
          {/* Research Evaluation Assessment Route */}
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

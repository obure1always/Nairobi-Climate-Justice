import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { useProgress } from './contexts/ProgressContext';
import { Layout } from './components/Layout';

// Placeholder Pages for now, will create them next
import Home from './pages/Home';
import Learn from './pages/Learn';
import Progress from './pages/Progress';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import About from './pages/About';
import Help from './pages/Help';
import LessonView from './components/LessonView';
import AssessmentView from './components/AssessmentView';
import Onboarding from './components/Onboarding';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useProgress();
  if (!settings?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        
        {/* Module Flow Routes */}
        <Route path="/module/:moduleId" element={<LessonView />} />
        
        {/* Final Assessment Route */}
        <Route path="/assessment" element={<AssessmentView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '@/store';
import Login from '@/pages/Login';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Expedientes from '@/pages/Expedientes';
import NuevoExpediente from '@/pages/NuevoExpediente';
import ExpedienteDetail from '@/pages/ExpedienteDetail';
import ColaRevision from '@/pages/ColaRevision';
import Administracion from '@/pages/Administracion';
import ManualOperacion from '@/pages/ManualOperacion';
import { NexosMasterConsole } from '@/pages/NexosMasterConsole';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authStep, currentUser } = useStore();
  if (authStep !== 'authenticated' || !currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
}

export default function App() {
  const { authStep } = useStore();

  return (
    <HashRouter>
      <Routes>
        {/* Public Tenant-Isolated Logins */}
        <Route
          path="/login"
          element={authStep === 'authenticated' ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/t/:slug/login"
          element={authStep === 'authenticated' ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/nexos/login"
          element={authStep === 'authenticated' ? <Navigate to="/nexos-admin" replace /> : <Login isMasterPortal />}
        />

        {/* Protected Core */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/expedientes" element={<ProtectedRoute><Expedientes /></ProtectedRoute>} />
        <Route path="/expedientes/nuevo" element={<ProtectedRoute><NuevoExpediente /></ProtectedRoute>} />
        <Route path="/expedientes/:id" element={<ProtectedRoute><ExpedienteDetail /></ProtectedRoute>} />
        <Route path="/revision" element={<ProtectedRoute><ColaRevision /></ProtectedRoute>} />
        <Route path="/manual" element={<ProtectedRoute><ManualOperacion /></ProtectedRoute>} />
        <Route path="/admin/usuarios" element={<ProtectedRoute><Administracion /></ProtectedRoute>} />
        <Route path="/admin/auditoria" element={<ProtectedRoute><Administracion /></ProtectedRoute>} />
        <Route path="/admin/config" element={<ProtectedRoute><Administracion /></ProtectedRoute>} />

        {/* NEXOS SaaS Master Admin Console */}
        <Route path="/nexos-admin" element={<ProtectedRoute><NexosMasterConsole /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={authStep === 'authenticated' ? '/' : '/login'} replace />} />
      </Routes>
    </HashRouter>
  );
}

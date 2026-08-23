import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@/store';
import { roleLabel } from '@/utils/helpers';
import {
  LayoutDashboard, FolderOpen, ClipboardList, Users, Settings,
  LogOut, Shield, ChevronLeft, ChevronRight, Bell, Wifi, WifiOff,
  FileCheck, BarChart3, Menu, X, BookOpen
} from 'lucide-react';

// ================================================================
// Layout principal — Sidebar + Header + Content area
// ================================================================

interface LayoutProps {
  children: React.ReactNode;
}

function NavItem({ to, icon: Icon, label, badge }: {
  to: string; icon: React.ElementType; label: string; badge?: number;
}) {
  const location = useLocation();
  const active = location.pathname.startsWith(to) && to !== '/';
  const exactActive = to === '/' && location.pathname === '/';
  return (
    <Link to={to} className={`sidebar-link ${active || exactActive ? 'active' : ''}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function AppLayout({ children }: LayoutProps) {
  const { currentUser, logout, expedientes, isOffline } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentUser) return null;

  const isAdmin = ['SUPER_ADMIN', 'ADMINISTRADOR'].includes(currentUser.role);
  const isReviewRole = ['SUPER_ADMIN', 'ADMINISTRADOR', 'COORDINADOR', 'REVISOR_SENIOR', 'REVISOR'].includes(currentUser.role);

  // Contadores para badges
  const pendingRevision = expedientes.filter(e =>
    ['LISTO_PARA_REVISION', 'REENVIADO'].includes(e.status)
  ).length;

  const myExpedientes = expedientes.filter(e => e.created_by === currentUser.id || isReviewRole);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src="/darey-icon-circle.jpg"
            alt="DAREY"
            className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0 border border-gray-100"
          />
          {!collapsed && (
            <div>
              <div className="font-bold text-carbon text-sm leading-tight tracking-wide">DAREY</div>
              <div className="text-text-muted text-[10px] leading-tight font-medium">Integrador de Expedientes</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && <p className="text-[10px] uppercase tracking-widest text-text-muted px-2 pb-1 font-semibold">Principal</p>}
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/expedientes" icon={FolderOpen} label="Expedientes" />

        {isReviewRole && (
          <>
            {!collapsed && <p className="text-[10px] uppercase tracking-widest text-text-muted px-2 pb-1 pt-3 font-semibold">Revisión</p>}
            <NavItem to="/revision" icon={ClipboardList} label="Cola de revisión" badge={pendingRevision} />
            <NavItem to="/matriz" icon={FileCheck} label="Matriz de control" />
          </>
        )}

        {isAdmin && (
          <>
            {!collapsed && <p className="text-[10px] uppercase tracking-widest text-text-muted px-2 pb-1 pt-3 font-semibold">Administración</p>}
            <NavItem to="/admin/usuarios" icon={Users} label="Usuarios" />
            <NavItem to="/admin/auditoria" icon={BarChart3} label="Auditoría" />
            <NavItem to="/admin/config" icon={Settings} label="Configuración" />
          </>
        )}

        {!collapsed && <p className="text-[10px] uppercase tracking-widest text-text-muted px-2 pb-1 pt-3 font-semibold">Ayuda & Guías</p>}
        <NavItem to="/manual" icon={BookOpen} label="Manual de Operación" />
      </nav>

      {/* User info */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-bg-subtle transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-azul-darey to-cian flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{currentUser.name.charAt(0)}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-carbon truncate">{currentUser.name}</div>
              <div className="text-[10px] text-text-muted">{roleLabel(currentUser.role)}</div>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="sidebar-link w-full mt-1 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Cerrar sesión'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-bg-light">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute top-20 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-bg-subtle z-10 hidden lg:flex"
        >
          {collapsed ? <ChevronRight className="w-3 h-3 text-text-muted" /> : <ChevronLeft className="w-3 h-3 text-text-muted" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-white shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-3 shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-bg-subtle text-text-muted"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex-1" />

          {/* Offline indicator */}
          {isOffline ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full">
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Sin conexión</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
              <Wifi className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-semibold text-green-700">En línea</span>
            </div>
          )}

          <button className="relative p-1.5 rounded-lg hover:bg-bg-subtle text-text-muted">
            <Bell className="w-5 h-5" />
            {pendingRevision > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                {pendingRevision}
              </span>
            )}
          </button>

          <div className="text-xs text-text-muted hidden sm:block">
            <span className="font-semibold text-carbon">{currentUser.username}</span>
            <span className="mx-1">·</span>
            {roleLabel(currentUser.role)}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

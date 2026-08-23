import React, { useState } from 'react';
import { useStore } from '@/store';
import { roleLabel, formatDate } from '@/utils/helpers';
import {
  Users, Plus, Eye, EyeOff, Shield, UserCheck, UserX, Settings, RefreshCw, BarChart3
} from 'lucide-react';
import type { UserRole } from '@/types';

// ================================================================
// Panel de Administración — Super Admin
// ================================================================

const ROLES: UserRole[] = ['AJUSTADOR', 'REVISOR', 'REVISOR_SENIOR', 'COORDINADOR', 'ADMINISTRADOR'];

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
        active ? 'border-azul-darey text-azul-darey' : 'border-transparent text-text-muted hover:text-carbon'
      }`}
    >
      {children}
    </button>
  );
}

export default function Administracion() {
  const { users, createUser, toggleUserActive, auditLog, currentUser } = useStore();
  const [tab, setTab] = useState<'usuarios' | 'auditoria' | 'config'>('usuarios');
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', name: '', role: 'AJUSTADOR' as UserRole, password: '' });
  const [saving, setSaving] = useState(false);

  if (!['SUPER_ADMIN', 'ADMINISTRADOR'].includes(currentUser?.role || '')) {
    return <div className="p-6 text-center text-text-muted">Acceso restringido.</div>;
  }

  const handleCreate = () => {
    if (!newUser.username || !newUser.name || !newUser.password) { alert('Completa todos los campos'); return; }
    setSaving(true);
    createUser({ ...newUser });
    setNewUser({ username: '', name: '', role: 'AJUSTADOR', password: '' });
    setShowNewUser(false);
    setSaving(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-carbon">Administración</h1>
        <p className="text-sm text-text-muted">Panel de control del sistema</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100">
        <TabButton active={tab === 'usuarios'} onClick={() => setTab('usuarios')}>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Usuarios</span>
        </TabButton>
        <TabButton active={tab === 'auditoria'} onClick={() => setTab('auditoria')}>
          <span className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4" /> Auditoría</span>
        </TabButton>
        <TabButton active={tab === 'config'} onClick={() => setTab('config')}>
          <span className="flex items-center gap-1.5"><Settings className="w-4 h-4" /> Configuración</span>
        </TabButton>
      </div>

      {/* USUARIOS */}
      {tab === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">{users.filter(u => u.active).length} usuarios activos</p>
            <button onClick={() => setShowNewUser(true)} className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Nuevo usuario
            </button>
          </div>

          {/* Nuevo usuario modal */}
          {showNewUser && (
            <div className="modal-overlay" onClick={() => setShowNewUser(false)}>
              <div className="modal-content p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-carbon flex items-center gap-2">
                  <Shield className="w-5 h-5 text-azul-darey" /> Crear nuevo usuario
                </h3>
                {[
                  { label: 'Nombre de usuario', key: 'username', placeholder: 'Ej. AJUSTADOR-05' },
                  { label: 'Nombre completo', key: 'name', placeholder: 'Nombre y apellidos' },
                  { label: 'Contraseña inicial', key: 'password', placeholder: '••••••••' },
                ].map(f => (
                  <div key={f.key} className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase">{f.label} *</label>
                    <input
                      className="input-darey"
                      type={f.key === 'password' ? 'password' : 'text'}
                      placeholder={f.placeholder}
                      value={(newUser as any)[f.key]}
                      onChange={e => setNewUser(p => ({ ...p, [f.key]: e.target.value }))}
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-muted uppercase">Rol *</label>
                  <select className="input-darey" value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value as UserRole }))}>
                    {ROLES.map(r => <option key={r} value={r}>{roleLabel(r)}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button className="btn-secondary" onClick={() => setShowNewUser(false)}>Cancelar</button>
                  <button className="btn-primary" onClick={handleCreate} disabled={saving}>
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Crear usuario
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users table */}
          <div className="card overflow-hidden">
            <div className="hidden lg:grid grid-cols-12 gap-3 px-4 py-2.5 bg-bg-subtle border-b border-gray-100 text-xs font-semibold text-text-muted uppercase tracking-wide">
              <div className="col-span-1">#</div>
              <div className="col-span-2">Usuario</div>
              <div className="col-span-3">Nombre</div>
              <div className="col-span-2">Rol</div>
              <div className="col-span-2 text-center">Autenticación Completa</div>
              <div className="col-span-1 text-center">Estado</div>
              <div className="col-span-1 text-center">Acciones</div>
            </div>
            {users.map((user, i) => (
              <div key={user.id} className="lg:grid grid-cols-12 gap-3 px-4 py-3 border-b border-gray-50 last:border-0 flex items-center hover:bg-bg-subtle transition-colors">
                <div className="col-span-1 text-xs text-text-muted">{i + 1}</div>
                <div className="col-span-2">
                  <div className="font-semibold text-sm text-carbon">{user.username}</div>
                  <div className="text-[10px] text-text-muted">{formatDate(user.created_at)}</div>
                </div>
                <div className="col-span-3 text-sm">{user.name}</div>
                <div className="col-span-2">
                  <span className="badge badge-cargada text-[10px]">{roleLabel(user.role)}</span>
                </div>
                <div className="col-span-2 text-center">
                  {user.mfa_enrolled ? (
                    <span className="badge badge-validada text-[10px]">
                      <Shield className="w-3 h-3 text-green-600 inline mr-1" /> Completa
                    </span>
                  ) : (
                    <span className="badge badge-pendiente text-[10px]">
                      <Shield className="w-3 h-3 text-gray-400 inline mr-1" /> Pendiente
                    </span>
                  )}
                </div>
                <div className="col-span-1 text-center">
                  {user.active ? (
                    <span className="badge badge-validada text-[10px]">Activo</span>
                  ) : (
                    <span className="badge badge-rechazada text-[10px]">Inactivo</span>
                  )}
                </div>
                <div className="col-span-1 flex justify-center">
                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => toggleUserActive(user.id)}
                      className={`p-1.5 rounded-lg transition-colors ${user.active ? 'hover:bg-red-50 text-red-500' : 'hover:bg-green-50 text-green-600'}`}
                      title={user.active ? 'Desactivar' : 'Activar'}
                    >
                      {user.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDITORÍA */}
      {tab === 'auditoria' && (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-azul-darey" />
            <span className="font-semibold text-sm text-carbon">Registro de auditoría</span>
            <span className="badge badge-cargada">{auditLog.length} eventos</span>
          </div>
          {auditLog.length === 0 ? (
            <div className="text-center py-12 text-text-muted">No hay eventos registrados aún.</div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-50">
              {auditLog.map(entry => (
                <div key={entry.id} className="px-4 py-2.5 flex items-start gap-3 hover:bg-bg-subtle transition-colors">
                  <div className="w-7 h-7 rounded-full bg-azul-darey/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-azul-darey text-[10px] font-bold">{entry.username.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-carbon">
                      <strong>{entry.username}</strong>
                      <span className="mx-1 text-text-muted">→</span>
                      <span className="font-mono text-xs bg-bg-subtle px-1.5 py-0.5 rounded">{entry.action}</span>
                    </div>
                    {entry.details && <div className="text-xs text-text-muted mt-0.5 truncate">{entry.details}</div>}
                  </div>
                  <div className="text-xs text-text-muted shrink-0">{formatDate(entry.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONFIG */}
      {tab === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-carbon border-b border-gray-100 pb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-azul-darey" /> Configuración de Watermark
            </h3>
            <div className="space-y-3 text-sm">
              {[
                ['Texto línea 1', 'DAREY'],
                ['Texto línea 2', 'SINIESTRO {numero}'],
                ['Opacidad', '25%'],
                ['Posición', 'Centro diagonal'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-text-muted">{k}</span>
                  <span className="font-medium text-carbon">{v}</span>
                </div>
              ))}
            </div>
            <button className="btn-secondary w-full text-sm">Editar configuración</button>
          </div>
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-carbon border-b border-gray-100 pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-azul-darey" /> Seguridad
            </h3>
            <div className="space-y-2 text-sm">
              {[
                ['MFA obligatorio', 'Sí'],
                ['Longitud mínima de contraseña', '8 caracteres'],
                ['Intentos fallidos antes de bloqueo', '5'],
                ['Expiración de sesión por inactividad', '30 min'],
                ['Cloudflare Turnstile', 'Activo'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-text-muted">{k}</span>
                  <span className="font-medium text-green-700">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

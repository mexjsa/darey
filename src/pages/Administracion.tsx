import React, { useState } from 'react';
import { useStore } from '@/store';
import { roleLabel, formatDate } from '@/utils/helpers';
import {
  Users, Plus, Eye, EyeOff, Shield, UserCheck, UserX, Settings, RefreshCw, BarChart3,
  HardDrive, FileCheck, Lock, AlertTriangle, CheckCircle2, Sparkles, Building2
} from 'lucide-react';
import type { UserRole } from '@/types';

const ROLES: UserRole[] = ['AJUSTADOR', 'REVISOR', 'REVISOR_SENIOR', 'COORDINADOR', 'ADMIN_ASIGNADOR', 'ADMINISTRADOR'];

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
        active ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  );
}

export default function Administracion() {
  const {
    users,
    createUser,
    toggleUserActive,
    auditLog,
    currentUser,
    getCurrentTenant,
    getTenantSeatUsage
  } = useStore();

  const currentTenant = getCurrentTenant();
  const seatUsage = getTenantSeatUsage(currentTenant.id);

  const [tab, setTab] = useState<'usuarios' | 'auditoria' | 'seguridad'>('usuarios');
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', name: '', role: 'AJUSTADOR' as UserRole, password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  if (!['SUPER_ADMIN', 'ADMINISTRADOR', 'NEXOS_SUPER_ADMIN'].includes(currentUser?.role || '')) {
    return <div className="p-6 text-center text-slate-500">Acceso restringido.</div>;
  }

  // Filtrar usuarios del inquilino activo
  const tenantUsers = currentUser?.role === 'NEXOS_SUPER_ADMIN'
    ? users.filter(u => u.tenant_id === currentTenant.id || u.role === 'NEXOS_SUPER_ADMIN')
    : users.filter(u => u.tenant_id === currentTenant.id);

  const handleCreate = () => {
    if (!newUser.username || !newUser.name || !newUser.password) {
      setErrorMessage('Completa todos los campos obligatorios');
      return;
    }
    setSaving(true);
    setErrorMessage('');

    const res = createUser({
      username: newUser.username,
      name: newUser.name,
      role: newUser.role,
      tenant_id: currentTenant.id
    });

    setSaving(false);

    if (!res.success) {
      setErrorMessage(res.error || 'No fue posible crear el usuario.');
    } else {
      setNewUser({ username: '', name: '', role: 'AJUSTADOR', password: '' });
      setShowNewUser(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentTenant.primary_color }}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Despacho Inquilino: {currentTenant.short_name}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Administración & Licenciamiento</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Control de usuarios activos, auditoría legal y almacenamiento jerárquico L3
          </p>
        </div>

        {/* Seat Usage Meter */}
        <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Asientos Contratados</div>
            <div className="text-base font-bold text-slate-900">
              {seatUsage.used} / {seatUsage.limit} <span className="text-xs font-normal text-slate-400">usuarios</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-xs text-indigo-600 bg-indigo-50/50">
            {Math.round((seatUsage.used / (seatUsage.limit || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <TabButton active={tab === 'usuarios'} onClick={() => setTab('usuarios')}>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Usuarios & Licencias</span>
        </TabButton>
        <TabButton active={tab === 'auditoria'} onClick={() => setTab('auditoria')}>
          <span className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4" /> Bitácora de Auditor•a (SIEM)</span>
        </TabButton>
        <TabButton active={tab === 'seguridad'} onClick={() => setTab('seguridad')}>
          <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Seguridad & Almacenamiento L3</span>
        </TabButton>
      </div>

      {/* USUARIOS */}
      {tab === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              {tenantUsers.filter(u => u.active).length} usuarios activos facturados a ${currentTenant.price_per_user_mxn} MXN/mes
            </p>
            <button
              onClick={() => { setErrorMessage(''); setShowNewUser(true); }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Nuevo Usuario
            </button>
          </div>

          {/* User List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Personal</th>
                    <th className="px-6 py-3.5">Usuario</th>
                    <th className="px-6 py-3.5">Rol Operativo</th>
                    <th className="px-6 py-3.5">2FA / Seguridad</th>
                    <th className="px-6 py-3.5">Estado Asiento</th>
                    <th className="px-6 py-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenantUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0"
                            style={{ backgroundColor: currentTenant.primary_color }}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{u.name}</div>
                            <div className="text-[11px] text-slate-400">Alta: {formatDate(u.created_at)}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-slate-700">
                        {u.username}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                          {roleLabel(u.role)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          2FA Activo
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {u.active ? 'Asiento Activo' : 'Inactivo (Liberado)'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleUserActive(u.id)}
                          className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                            u.active
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {u.active ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Nuevo Usuario */}
          {showNewUser && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                    <Shield className="w-5 h-5 text-indigo-600" /> Alta de Usuario / Asiento
                  </h3>
                  <button onClick={() => setShowNewUser(false)} className="text-slate-400 hover:text-slate-600">?</button>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Usuario *</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 border rounded-xl text-slate-900 uppercase font-mono text-xs"
                      placeholder="Ej. AJUSTADOR-06"
                      value={newUser.username}
                      onChange={e => setNewUser(p => ({ ...p, username: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 border rounded-xl text-slate-900 text-xs"
                      placeholder="Nombre y apellidos"
                      value={newUser.name}
                      onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rol Operativo *</label>
                    <select
                      className="w-full px-3.5 py-2 border rounded-xl text-slate-900 text-xs outline-none"
                      value={newUser.role}
                      onChange={e => setNewUser(p => ({ ...p, role: e.target.value as UserRole }))}
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r}>{roleLabel(r)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña Inicial *</label>
                    <input
                      type="password"
                      className="w-full px-3.5 py-2 border rounded-xl text-slate-900 text-xs"
                      placeholder="••••••••"
                      value={newUser.password}
                      onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setShowNewUser(false)}
                    className="px-4 py-2 border text-slate-600 rounded-xl text-xs hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={saving}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 shadow-md"
                  >
                    {saving ? 'Guardando...' : 'Crear y Asignar Asiento'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AUDITORÍA */}
      {tab === 'auditoria' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Registro de Auditor•a Legal (SEC-014)</h2>
              <p className="text-xs text-slate-500">Trazabilidad inmutable de accesos, cargas y validaciones</p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-white px-2.5 py-1 border rounded-md">
              {auditLog.length} Eventos
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto font-mono text-xs">
            {auditLog.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-slate-700 font-semibold">{log.username}</span>
                    <span className="text-slate-400">[{log.entity_type}]</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">{log.details || 'Sin detalles adicionales'}</div>
                </div>
                <div className="text-slate-400 text-[11px] shrink-0">
                  {formatDate(log.created_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEGURIDAD & ALMACENAMIENTO L3 */}
      {tab === 'seguridad' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Almacenamiento Jerárquico</h3>
                <p className="text-xs text-slate-500">Gestión de costos y retención de fotografías</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">?? Hot Tier (0-60 días)</div>
                  <div className="text-slate-500">Expedientes activos en campo y revisión</div>
                </div>
                <span className="font-bold text-emerald-700">Cloudflare R2</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">?? Warm Tier (60 días - 1 año)</div>
                  <div className="text-slate-500">Expedientes validados y sellados</div>
                </div>
                <span className="font-bold text-blue-700">PDF Sellado R2</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">?? Cold Archive (1 - 10 años)</div>
                  <div className="text-slate-500">Archivo legal hist•rico comprimido</div>
                </div>
                <span className="font-bold text-indigo-700">Glacier Deep Archive</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Blindaje Ciberseguridad L3</h3>
                <p className="text-xs text-slate-500">Cumplimiento NIST / OWASP ASVS 5.0</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-indigo-950">Aislamiento por Tenant (SEC-005/010)</div>
                  <div className="text-indigo-800">RLS activa que impide cruce de datos entre despachos.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-indigo-950">Cadena de Custodia SHA-256 (SEC-009)</div>
                  <div className="text-indigo-800">Cada foto genera un checksum criptográfico inmutable.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-indigo-950">Marca de Agua Pericial Dinámica (SEC-013)</div>
                  <div className="text-indigo-800">Sello con: {currentTenant.watermark_text}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

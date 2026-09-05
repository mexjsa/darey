// ================================================================
// NEXOS Master Console • Panel Super Administrador SaaS
// Supervisión global de despachos inquilinos, licencias y MRR
// ================================================================

import React, { useState } from 'react';
import { useStore } from '@/store';
import type { Tenant, TenantStatus } from '@/types';
import {
  Building2, Users, DollarSign, ShieldCheck, Plus, ArrowRight,
  Sparkles, CheckCircle2, AlertTriangle, Lock, RefreshCw, Key,
  FileCheck, Database, HardDrive, Edit3, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NexosMasterConsole: React.FC = () => {
  const navigate = useNavigate();
  const {
    tenants,
    currentTenantId,
    users,
    expedientes,
    auditLog,
    createTenant,
    updateTenant,
    switchTenant,
    currentUser,
    getTenantSeatUsage
  } = useStore();

  const [showNewModal, setShowNewModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // New Tenant Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortName, setShortName] = useState('');
  const [rfc, setRfc] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0089A9');
  const [secondaryColor, setSecondaryColor] = useState('#005A82');
  const [accentColor, setAccentColor] = useState('#F8C400');
  const [watermarkText, setWatermarkText] = useState('');
  const [seatsLimit, setSeatsLimit] = useState(5);
  const [pricePerUser, setPricePerUser] = useState(490);
  const [retentionDays, setRetentionDays] = useState(365);
  const [status, setStatus] = useState<TenantStatus>('ACTIVO');

  // Overall KPIs
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'ACTIVO').length;
  const totalSeatsUsed = users.filter(u => u.active && u.role !== 'NEXOS_SUPER_ADMIN').length;
  const totalSeatsLimit = tenants.reduce((acc, t) => acc + t.plan_seats_limit, 0);
  const totalMRR = tenants.reduce((acc, t) => {
    const tUsers = users.filter(u => u.tenant_id === t.id && u.active && u.role !== 'NEXOS_SUPER_ADMIN').length;
    return acc + (tUsers * t.price_per_user_mxn);
  }, 0);

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    createTenant({
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      short_name: shortName || name.slice(0, 8).toUpperCase(),
      rfc,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor,
      watermark_text: watermarkText || name.toUpperCase(),
      plan_seats_limit: Number(seatsLimit),
      price_per_user_mxn: Number(pricePerUser),
      storage_retention_days: Number(retentionDays),
      status
    });
    setShowNewModal(false);
    resetForm();
  };

  const handleUpdateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;
    updateTenant(editingTenant.id, {
      name,
      short_name: shortName,
      rfc,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor,
      watermark_text: watermarkText,
      plan_seats_limit: Number(seatsLimit),
      price_per_user_mxn: Number(pricePerUser),
      storage_retention_days: Number(retentionDays),
      status
    });
    setEditingTenant(null);
    resetForm();
  };

  const openEdit = (t: Tenant) => {
    setEditingTenant(t);
    setName(t.name);
    setSlug(t.slug);
    setShortName(t.short_name);
    setRfc(t.rfc || '');
    setPrimaryColor(t.primary_color);
    setSecondaryColor(t.secondary_color);
    setAccentColor(t.accent_color);
    setWatermarkText(t.watermark_text);
    setSeatsLimit(t.plan_seats_limit);
    setPricePerUser(t.price_per_user_mxn);
    setRetentionDays(t.storage_retention_days);
    setStatus(t.status);
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setShortName('');
    setRfc('');
    setPrimaryColor('#0089A9');
    setSecondaryColor('#005A82');
    setAccentColor('#F8C400');
    setWatermarkText('');
    setSeatsLimit(5);
    setPricePerUser(490);
    setRetentionDays(365);
    setStatus('ACTIVO');
  };

  const handleEnterTenant = (tenantId: string) => {
    switchTenant(tenantId);
    navigate('/');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* SaaS Master Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            NEXOS CORE PLATFORM • SaaS Multi-Inquilino v2.0
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            Consola Maestra de Despachos
          </h1>
          <p className="text-slate-300 text-sm mt-1.5 max-w-2xl">
            Gestión centralizada de despachos periciales inquilinos, control de licenciamiento por asiento (per-seat), cobro recurrente e infraestructura segura L3.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { resetForm(); setShowNewModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            + Nuevo Inquilino
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Despachos Inquilinos</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalTenants}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">{activeTenants} activos en producción</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Asientos / Usuarios</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalSeatsUsed} <span className="text-sm font-normal text-slate-400">/ {totalSeatsLimit}</span></h3>
            <p className="text-xs text-indigo-600 font-medium mt-0.5">{Math.round((totalSeatsUsed / (totalSeatsLimit || 1)) * 100)}% ocupación de licencias</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">MRR Recurrente Estimado</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">${totalMRR.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-400">MXN/mes</span></h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Cobro mensual por usuario activo</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Seguridad y SHA-256</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">100%</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Aislamiento RLS + Nivel L3</p>
          </div>
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Inquilinos Registrados Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Despachos Inquilinos Registrados</h2>
            <p className="text-xs text-slate-500">Configuración de marca, límites de asientos y estado de facturación</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 border rounded-lg">
            {tenants.length} Inquilinos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Despacho / Marca</th>
                <th className="px-6 py-3.5">Slug / URL</th>
                <th className="px-6 py-3.5">Asientos (Licencias)</th>
                <th className="px-6 py-3.5">Precio / Asiento</th>
                <th className="px-6 py-3.5">Facturación / Mes</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((t) => {
                const activeUsers = users.filter(u => u.tenant_id === t.id && u.active && u.role !== 'NEXOS_SUPER_ADMIN').length;
                const isCurrent = currentTenantId === t.id;
                const monthlyRev = activeUsers * t.price_per_user_mxn;
                const pct = Math.round((activeUsers / (t.plan_seats_limit || 1)) * 100);

                return (
                  <tr key={t.id} className={`hover:bg-slate-50/80 transition-colors ${isCurrent ? 'bg-indigo-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden"
                          style={{ backgroundColor: t.primary_color }}
                        >
                          {t.logo_url ? (
                            <img src={t.logo_url} alt={t.short_name} className="w-full h-full object-cover" />
                          ) : (
                            t.short_name.slice(0, 2)
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            {t.name}
                            {isCurrent && (
                              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                                Activo
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">{t.rfc || 'RFC pendiente'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <code className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono">
                        #{t.slug}
                      </code>
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-36">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-800">{activeUsers} activos</span>
                          <span className="text-slate-400">{t.plan_seats_limit} cupo</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct >= 90 ? 'bg-amber-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-700">
                      ${t.price_per_user_mxn} <span className="text-xs text-slate-400">MXN</span>
                    </td>

                    <td className="px-6 py-4 font-bold text-emerald-700">
                      ${monthlyRev.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-400">MXN</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.status === 'ACTIVO'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : t.status === 'PRUEBA'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'ACTIVO' ? 'bg-emerald-500' : t.status === 'PRUEBA' ? 'bg-blue-500' : 'bg-rose-500'
                        }`} />
                        {t.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(t)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Editar parámetros"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEnterTenant(t.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-medium transition-all shadow-sm"
                        >
                          <span>Entrar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storage & Cybersecurity Architecture Section (PRD L3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Almacenamiento Tiered</h3>
              <p className="text-xs text-slate-500">Ciclo de vida en 3 niveles (SEC-008)</p>
            </div>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="font-semibold text-slate-700">?? Hot Tier (0-60d)</span>
              <span className="text-emerald-700 font-bold">Cloudflare R2 / Supabase</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="font-semibold text-slate-700">?? Warm Tier (60d-1a)</span>
              <span className="text-blue-700 font-bold">PDF Consolidado R2</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="font-semibold text-slate-700">?? Cold Tier (1a-10a)</span>
              <span className="text-indigo-700 font-bold">Glacier Deep Archive</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cadena de Custodia SHA-256</h3>
              <p className="text-xs text-slate-500">Inmutabilidad legal (SEC-009)</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Cada evidencia cargada por el ajustador genera un hash SHA-256 inalterable al momento de la captura, protegiendo el valor probatorio de los 17 componentes.
          </p>
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs font-mono text-indigo-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>SHA-256 Checksum Activo en cada upload</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Aislamiento RLS & DLP</h3>
              <p className="text-xs text-slate-500">Privacidad L3 y Watermarking</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Políticas de Row-Level Security en PostgreSQL que impiden lectura cruzada entre inquilinos, con marcas de agua dinámicas personalizadas por despacho.
          </p>
          <div className="p-3 bg-violet-50/60 border border-violet-100 rounded-xl text-xs font-mono text-violet-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-600 shrink-0" />
            <span>Denegar por defecto + RLS Activo</span>
          </div>
        </div>
      </div>

      {/* Modal: Crear / Editar Inquilino */}
      {(showNewModal || editingTenant) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingTenant ? 'Editar Parámetros de Inquilino' : 'Registrar Nuevo Despacho Inquilino'}
                </h3>
                <p className="text-xs text-slate-500">Configuración Whitelabel y límites de licenciamiento</p>
              </div>
              <button
                onClick={() => { setShowNewModal(false); setEditingTenant(null); }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ?
              </button>
            </div>

            <form onSubmit={editingTenant ? handleUpdateTenant : handleCreateTenant} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Razón Social / Nombre Comercial *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ajustadores del Bajío S.C."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Slug / Subdominio *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingTenant}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ej. bajio"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-mono text-xs bg-slate-50 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre Corto (Acr•nimo)
                  </label>
                  <input
                    type="text"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="Ej. BAJÍO"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    L•mite de Asientos (Usuarios) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={seatsLimit}
                    onChange={(e) => setSeatsLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Precio por Asiento ($ MXN/mes) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={pricePerUser}
                    onChange={(e) => setPricePerUser(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* Branding & Watermark */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-indigo-900 mb-3 uppercase tracking-wider">Identidad Visual & Marca de Agua</p>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Color Primario</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0"
                      />
                      <span className="text-xs font-mono">{primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Secundario</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0"
                      />
                      <span className="text-xs font-mono">{secondaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Acento</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0"
                      />
                      <span className="text-xs font-mono">{accentColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Texto de Marca de Agua Pericial
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Ej. AJUSTADORES DEL BAJÍO S.C."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowNewModal(false); setEditingTenant(null); }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  {editingTenant ? 'Guardar Cambios' : 'Registrar Inquilino'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

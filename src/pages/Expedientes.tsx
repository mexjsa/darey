import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import {
  expedienteStatusClass, expedienteStatusLabel, semaforo, progressColor,
  formatDateShort, isRevisor, canAssign, prioridadClass, prioridadLabel
} from '@/utils/helpers';
import {
  FolderOpen, Plus, Search, Filter, ChevronRight, FileText, Clock, AlertCircle,
  CheckCircle, RefreshCw, Eye, X, MapPin, UserCheck, Car, Zap
} from 'lucide-react';
import type { Expediente, ExpedienteStatus } from '@/types';

// ================================================================
// Lista de expedientes con filtros de Asignación y Estado
// ================================================================

const STATUS_OPTIONS: ExpedienteStatus[] = [
  'ASIGNADO', 'EN_INTEGRACION', 'LISTO_PARA_REVISION', 'EN_REVISION',
  'CON_OBSERVACIONES', 'EN_CORRECCION', 'REENVIADO', 'VALIDADO', 'CERRADO', 'BLOQUEADO'
];

export default function Expedientes() {
  const { currentUser, expedientes, users, getAdjusters, getCurrentTenant } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExpedienteStatus | 'TODOS'>('TODOS');
  const [adjusterFilter, setAdjusterFilter] = useState<string>('TODOS');
  const [showFilters, setShowFilters] = useState(false);

  if (!currentUser) return null;
  const currentTenant = getCurrentTenant();
  const isNexosMaster = currentUser.role === 'NEXOS_SUPER_ADMIN';
  const isAssigner = canAssign(currentUser.role) || isNexosMaster;
  const isReviewer = isRevisor(currentUser.role) || isNexosMaster;
  const canSeeAll = isAssigner || isReviewer;
  const adjusters = getAdjusters();

  const tenantExpedientes = isNexosMaster
    ? expedientes
    : expedientes.filter(e => e.tenant_id === currentTenant.id);

  const base = canSeeAll
    ? tenantExpedientes
    : tenantExpedientes.filter(e => e.assigned_to === currentUser.id);

  const filtered = base.filter(exp => {
    const matchStatus = statusFilter === 'TODOS' || exp.status === statusFilter;
    const matchAdjuster = adjusterFilter === 'TODOS' || exp.assigned_to === adjusterFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      exp.numero_siniestro.toLowerCase().includes(q) ||
      exp.asegurado.nombre.toLowerCase().includes(q) ||
      exp.vehiculo_asegurado.placas.toLowerCase().includes(q) ||
      exp.vehiculo_asegurado.marca?.toLowerCase().includes(q) ||
      exp.vehiculo_asegurado.color?.toLowerCase().includes(q) ||
      exp.reporte?.ubicacion_siniestro?.toLowerCase().includes(q) ||
      exp.aseguradora.toLowerCase().includes(q) ||
      exp.folio_dua.toLowerCase().includes(q);
    return matchStatus && matchAdjuster && matchSearch;
  });

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-carbon">
            {currentUser.role === 'AJUSTADOR' ? 'Mis Siniestros Asignados' : 'Control de Expedientes'}
          </h1>
          <p className="text-sm text-text-muted">{filtered.length} de {base.length} siniestros registrados</p>
        </div>
        {isAssigner && (
          <Link to="/expedientes/nuevo" className="btn-primary">
            <Plus className="w-4 h-4" /> Nuevo reporte / Asignar
          </Link>
        )}
      </div>

      {/* Search + Filters */}
      <div className="card p-3 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              className="input-darey pl-9"
              placeholder="Buscar por siniestro, placas, color, asegurado, ubicación, aseguradora..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-carbon">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilters(v => !v)} className={`btn-secondary ${showFilters ? 'border-azul-darey/30 bg-bg-subtle' : ''}`}>
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            {/* Filter by Status */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">Estado:</div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setStatusFilter('TODOS')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${statusFilter === 'TODOS' ? 'bg-azul-darey text-white' : 'bg-bg-subtle text-text-muted hover:bg-gray-100'}`}
                >
                  Todos
                </button>
                {STATUS_OPTIONS.map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${statusFilter === st ? 'bg-azul-darey text-white' : 'bg-bg-subtle text-text-muted hover:bg-gray-100'}`}
                  >
                    {expedienteStatusLabel(st)}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Adjuster (for central/admin) */}
            {canSeeAll && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">Ajustador asignado:</div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setAdjusterFilter('TODOS')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${adjusterFilter === 'TODOS' ? 'bg-azul-profundo text-white' : 'bg-bg-subtle text-text-muted hover:bg-gray-100'}`}
                  >
                    Todos los ajustadores
                  </button>
                  {adjusters.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setAdjusterFilter(a.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${adjusterFilter === a.id ? 'bg-azul-profundo text-white' : 'bg-bg-subtle text-text-muted hover:bg-gray-100'}`}
                    >
                      {a.username} ({a.name})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p className="font-semibold text-carbon">Sin expedientes encontrados</p>
            <p className="text-sm mt-1">Ajusta los términos de búsqueda o filtros.</p>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div className="hidden lg:grid grid-cols-12 gap-3 px-4 py-2.5 bg-bg-subtle border-b border-gray-100 text-xs font-semibold text-text-muted uppercase tracking-wide">
              <div className="col-span-2">Siniestro / Fecha</div>
              <div className="col-span-3">Vehículo & Ubicación</div>
              <div className="col-span-2">Aseguradora / Asegurado</div>
              <div className="col-span-2">Ajustador Asignado</div>
              <div className="col-span-2">Estado & Progreso</div>
              <div className="col-span-1 text-right">Acción</div>
            </div>

            {filtered.map(exp => (
              <ExpRow key={exp.id} exp={exp} canSeeAll={canSeeAll} users={users} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ExpRow({ exp, canSeeAll, users }: { exp: Expediente; canSeeAll: boolean; users: any[] }) {
  const sf = semaforo(exp.integration_percent);
  const assigned = users.find(u => u.id === exp.assigned_to);

  return (
    <Link
      to={`/expedientes/${exp.id}`}
      className={`block border-b border-gray-50 last:border-0 hover:bg-bg-subtle transition-colors ${
        exp.status === 'ASIGNADO' ? 'bg-violet-50/30' : ''
      }`}
    >
      <div className="lg:grid grid-cols-12 gap-3 px-4 py-3 flex items-center">
        {/* Siniestro */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-azul-darey/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-azul-darey" />
            </div>
            <div>
              <div className="font-bold text-sm text-carbon">#{exp.numero_siniestro}</div>
              <div className="text-[10px] text-text-muted">{formatDateShort(exp.fecha_siniestro)} {exp.hora_siniestro || ''}</div>
            </div>
          </div>
        </div>

        {/* Vehículo & Ubicación */}
        <div className="col-span-3 hidden lg:block">
          <div className="text-xs font-semibold text-carbon flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-azul-darey shrink-0" />
            <span>{exp.vehiculo_asegurado.placas}</span>
            <span className="text-text-muted">({exp.vehiculo_asegurado.color || ''} {exp.vehiculo_asegurado.marca || ''})</span>
          </div>
          {exp.reporte?.ubicacion_siniestro && (
            <div className="text-[11px] text-text-muted truncate flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
              <span className="truncate">{exp.reporte.ubicacion_siniestro}</span>
            </div>
          )}
        </div>

        {/* Aseguradora / Asegurado */}
        <div className="col-span-2 hidden lg:block">
          <div className="text-sm font-medium text-carbon truncate">{exp.asegurado.nombre || '—'}</div>
          <div className="text-xs text-text-muted truncate">{exp.aseguradora}</div>
        </div>

        {/* Ajustador Asignado */}
        <div className="col-span-2 hidden lg:block">
          {assigned ? (
            <div>
              <div className="text-xs font-bold text-azul-profundo">{assigned.username}</div>
              <div className="text-[10px] text-text-muted truncate">{assigned.name}</div>
            </div>
          ) : (
            <span className="text-xs text-amber-600 font-semibold italic">Sin asignar</span>
          )}
        </div>

        {/* Estado & Progreso */}
        <div className="col-span-2 hidden lg:block">
          <div className="mb-1">
            <span className={expedienteStatusClass(exp.status)}>{expedienteStatusLabel(exp.status)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="progress-bar flex-1">
              <div className={`progress-fill ${progressColor(exp.integration_percent)}`} style={{ width: `${exp.integration_percent}%` }} />
            </div>
            <span className={`text-xs font-bold ${sf.color} w-8 text-right`}>{exp.integration_percent}%</span>
          </div>
        </div>

        {/* Mobile: summary */}
        <div className="flex-1 lg:hidden ml-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm">#{exp.numero_siniestro}</span>
            <span className={expedienteStatusClass(exp.status)}>{expedienteStatusLabel(exp.status)}</span>
          </div>
          <div className="text-xs text-text-muted font-medium">
            {exp.vehiculo_asegurado.placas} · {exp.asegurado.nombre}
          </div>
          {exp.reporte?.ubicacion_siniestro && (
            <div className="text-[10px] text-text-muted truncate mt-0.5">
              📍 {exp.reporte.ubicacion_siniestro}
            </div>
          )}
        </div>

        {/* Action */}
        <div className="col-span-1 flex justify-end">
          <ChevronRight className="w-4 h-4 text-text-muted" />
        </div>
      </div>
    </Link>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store';
import {
  semaforo, progressColor, expedienteStatusClass, expedienteStatusLabel,
  formatDateShort, isRevisor, canAssign, isMyExpediente, prioridadClass, prioridadLabel
} from '@/utils/helpers';
import {
  FolderOpen, Clock, AlertCircle, CheckCircle, Plus, TrendingUp,
  FileText, Eye, RefreshCw, MapPin, Zap, UserCheck, Radio, Car
} from 'lucide-react';
import type { Expediente } from '@/types';

// ================================================================
// Dashboard — Flujo Central de Asignación / Ajustador / Revisor
// ================================================================

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: number | string; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-carbon">{value}</div>
        <div className="text-sm font-medium text-text-muted">{label}</div>
        {sub && <div className="text-xs text-text-muted mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function ExpedienteCard({ exp, isAdjuster }: { exp: Expediente; isAdjuster?: boolean }) {
  const { users } = useStore();
  const sf = semaforo(exp.integration_percent);
  const sfV = semaforo(exp.validation_percent);
  const assignedAdjuster = users.find(u => u.id === exp.assigned_to);
  const isNuevoAsignado = exp.status === 'ASIGNADO';

  return (
    <Link
      to={`/expedientes/${exp.id}`}
      className={`block p-4 border-b border-gray-100 last:border-0 hover:bg-bg-subtle transition-all ${
        isNuevoAsignado ? 'bg-violet-50/40 border-l-4 border-l-violet-600' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base text-carbon">#{exp.numero_siniestro}</span>
            <span className={expedienteStatusClass(exp.status)}>{expedienteStatusLabel(exp.status)}</span>
            {exp.reporte?.prioridad && exp.reporte.prioridad !== 'NORMAL' && (
              <span className={prioridadClass(exp.reporte.prioridad)}>
                <Zap className="w-3 h-3 inline mr-1" />
                {prioridadLabel(exp.reporte.prioridad)}
              </span>
            )}
            {exp.observaciones_abiertas > 0 && (
              <span className="badge badge-observada">
                <AlertCircle className="w-3 h-3" /> {exp.observaciones_abiertas} obs.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-carbon">
            <Car className="w-3.5 h-3.5 text-azul-darey shrink-0" />
            <span>{exp.vehiculo_asegurado.placas}</span>
            <span className="text-text-muted">·</span>
            <span>{exp.vehiculo_asegurado.color || ''} {exp.vehiculo_asegurado.marca || ''} {exp.vehiculo_asegurado.modelo || ''}</span>
            <span className="text-text-muted">({exp.asegurado.nombre})</span>
          </div>

          {exp.reporte?.ubicacion_siniestro && (
            <div className="flex items-center gap-1.5 text-xs text-text-muted truncate">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{exp.reporte.ubicacion_siniestro}</span>
            </div>
          )}

          <div className="text-[11px] text-text-muted flex items-center gap-3">
            <span><strong>Aseguradora:</strong> {exp.aseguradora}</span>
            {!isAdjuster && assignedAdjuster && (
              <span className="text-azul-darey">
                <strong>Ajustador:</strong> {assignedAdjuster.username} ({assignedAdjuster.name})
              </span>
            )}
            <span><strong>Fecha:</strong> {formatDateShort(exp.fecha_siniestro)} {exp.hora_siniestro || ''}</span>
          </div>
        </div>

        {/* Progress and Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {isNuevoAsignado ? (
            <div className="bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Atender siniestro →
            </div>
          ) : (
            <div className="text-right space-y-1 w-32 hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-text-muted w-14 text-right">Integ.</span>
                <div className="progress-bar flex-1">
                  <div className={`progress-fill ${progressColor(exp.integration_percent)}`} style={{ width: `${exp.integration_percent}%` }} />
                </div>
                <span className={`text-xs font-bold ${sf.color} w-8 text-right`}>{exp.integration_percent}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-text-muted w-14 text-right">Valid.</span>
                <div className="progress-bar flex-1">
                  <div className={`progress-fill ${progressColor(exp.validation_percent)}`} style={{ width: `${exp.validation_percent}%` }} />
                </div>
                <span className={`text-xs font-bold ${sfV.color} w-8 text-right`}>{exp.validation_percent}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { currentUser, expedientes, getCurrentTenant } = useStore();
  if (!currentUser) return null;

  const currentTenant = getCurrentTenant();
  const myRole = currentUser.role;
  const isNexosMaster = myRole === 'NEXOS_SUPER_ADMIN';
  const isRevRole = isRevisor(myRole) || isNexosMaster;
  const isAssignerRole = canAssign(myRole) || isNexosMaster;
  const isAdjuster = myRole === 'AJUSTADOR';

  // Expedientes filtrados según inquilino y rol
  const tenantExpedientes = isNexosMaster
    ? expedientes
    : expedientes.filter(e => e.tenant_id === currentTenant.id);

  const myExps = isAdjuster
    ? tenantExpedientes.filter(e => e.assigned_to === currentUser.id)
    : tenantExpedientes;

  const recienAsignados = myExps.filter(e => e.status === 'ASIGNADO');

  const stats = {
    total: myExps.length,
    asignados: myExps.filter(e => e.status === 'ASIGNADO').length,
    enIntegracion: myExps.filter(e => ['ASIGNADO', 'BORRADOR', 'EN_INTEGRACION'].includes(e.status)).length,
    conObs: myExps.filter(e => ['CON_OBSERVACIONES', 'EN_CORRECCION'].includes(e.status)).length,
    enRevision: myExps.filter(e => ['LISTO_PARA_REVISION', 'EN_REVISION', 'REENVIADO'].includes(e.status)).length,
    validados: myExps.filter(e => ['VALIDADO', 'CERRADO'].includes(e.status)).length,
    avgIntegracion: myExps.length ? Math.round(myExps.reduce((a, e) => a + e.integration_percent, 0) / myExps.length) : 0,
  };

  const pendingRevision = expedientes.filter(e => ['LISTO_PARA_REVISION', 'REENVIADO'].includes(e.status));

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-carbon">
            {isAdjuster ? 'Mis Siniestros Asignados' : isAssignerRole ? 'Central de Asignaciones & Control' : 'Panel de Revisión'}
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            Bienvenido, <strong>{currentUser.name}</strong> · {currentUser.username}
          </p>
        </div>
        {isAssignerRole && (
          <Link to="/expedientes/nuevo" className="btn-primary">
            <Plus className="w-4 h-4" />
            Nuevo reporte / Asignar
          </Link>
        )}
      </div>

      {/* Alerta de nuevos siniestros asignados para ajustador */}
      {isAdjuster && recienAsignados.length > 0 && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 animate-pulse text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">Tienes {recienAsignados.length} siniestro(s) asignado(s) por la central</div>
              <div className="text-sm text-white/80">Revisa la ubicación, placas y datos del vehículo para trasladarte a la escena.</div>
            </div>
          </div>
          <Link to={`/expedientes/${recienAsignados[0].id}`} className="px-4 py-2 bg-white text-violet-700 font-bold text-sm rounded-lg hover:bg-gray-100 transition-all shadow">
            Ver siniestro urgente →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label={isAdjuster ? "Mis siniestros" : "Total expedientes"}
          value={stats.total}
          icon={FolderOpen}
          color="bg-azul-darey"
        />
        <StatCard
          label={isAdjuster ? "Por integrar" : "En campo / asignados"}
          value={stats.enIntegracion}
          icon={Radio}
          color="bg-violet-600"
          sub={stats.asignados > 0 ? `${stats.asignados} sin iniciar` : undefined}
        />
        <StatCard
          label={isRevRole ? "Pendientes revisión" : "Con observaciones"}
          value={isRevRole ? stats.enRevision : stats.conObs}
          icon={AlertCircle}
          color="bg-amber-500"
        />
        <StatCard
          label="Validados / Cerrados"
          value={stats.validados}
          icon={CheckCircle}
          color="bg-green-600"
        />
      </div>

      {/* Integración promedio */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-azul-darey" />
          <span className="font-semibold text-sm text-carbon">
            {isAdjuster ? 'Progreso de integración de mis siniestros' : 'Integración promedio general'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 progress-bar">
            <div className={`progress-fill ${progressColor(stats.avgIntegracion)}`} style={{ width: `${stats.avgIntegracion}%` }} />
          </div>
          <span className={`text-xl font-bold ${semaforo(stats.avgIntegracion).color}`}>{stats.avgIntegracion}%</span>
        </div>
      </div>

      {/* Cola de revisión (revisores) */}
      {isRevRole && pendingRevision.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-azul-darey" />
              <span className="font-semibold text-sm text-carbon">Cola de revisión pendiente</span>
              <span className="badge badge-en-revision">{pendingRevision.length}</span>
            </div>
            <Link to="/revision" className="text-xs text-azul-darey font-semibold hover:underline">Ver todo →</Link>
          </div>
          <div>
            {pendingRevision.slice(0, 4).map(exp => (
              <ExpedienteCard key={exp.id} exp={exp} />
            ))}
          </div>
        </div>
      )}

      {/* Lista de expedientes */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-azul-darey" />
            <span className="font-semibold text-sm text-carbon">
              {isAdjuster ? 'Siniestros asignados a mí' : 'Expedientes activos'}
            </span>
          </div>
          <Link to="/expedientes" className="text-xs text-azul-darey font-semibold hover:underline">Ver todos →</Link>
        </div>
        {myExps.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Sin expedientes asignados</p>
            {isAssignerRole && (
              <Link to="/expedientes/nuevo" className="btn-primary mt-4 mx-auto">
                <Plus className="w-4 h-4" /> Registrar reporte y asignar
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {myExps.map(exp => (
              <ExpedienteCard key={exp.id} exp={exp} isAdjuster={isAdjuster} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

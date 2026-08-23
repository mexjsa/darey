// ================================================================
// Helpers de estado — badges, colores, semáforos
// ================================================================

import type { EvidenciaStatus, ExpedienteStatus, UserRole } from '@/types';

export function statusLabel(status: EvidenciaStatus): string {
  const map: Record<EvidenciaStatus, string> = {
    PENDIENTE: 'Pendiente',
    CARGADA: 'Cargada',
    EN_REVISION: 'En revisión',
    OBSERVADA: 'Observada',
    RECHAZADA: 'Rechazada',
    VALIDADA: 'Validada',
    NO_APLICA: 'No aplica',
    SUSTITUIDA: 'Sustituida',
  };
  return map[status] || status;
}

export function expedienteStatusLabel(status: ExpedienteStatus): string {
  const map: Record<ExpedienteStatus, string> = {
    BORRADOR: 'Borrador',
    ASIGNADO: 'Asignado',
    EN_INTEGRACION: 'En integración',
    LISTO_PARA_REVISION: 'Listo para revisión',
    EN_REVISION: 'En revisión',
    CON_OBSERVACIONES: 'Con observaciones',
    EN_CORRECCION: 'En corrección',
    REENVIADO: 'Reenviado',
    VALIDADO: 'Validado',
    CERRADO: 'Cerrado',
    BLOQUEADO: 'Bloqueado',
    REABIERTO: 'Reabierto',
  };
  return map[status] || status;
}

export function evidenciaBadgeClass(status: EvidenciaStatus): string {
  const map: Record<EvidenciaStatus, string> = {
    PENDIENTE: 'badge badge-pendiente',
    CARGADA: 'badge badge-cargada',
    EN_REVISION: 'badge badge-en-revision',
    OBSERVADA: 'badge badge-observada',
    RECHAZADA: 'badge badge-rechazada',
    VALIDADA: 'badge badge-validada',
    NO_APLICA: 'badge badge-no-aplica',
    SUSTITUIDA: 'badge badge-sustituida',
  };
  return map[status] || 'badge';
}

export function expedienteStatusClass(status: ExpedienteStatus): string {
  const map: Record<ExpedienteStatus, string> = {
    BORRADOR: 'badge status-borrador',
    ASIGNADO: 'badge status-asignado',
    EN_INTEGRACION: 'badge status-en-integracion',
    LISTO_PARA_REVISION: 'badge status-listo-revision',
    EN_REVISION: 'badge status-en-revision',
    CON_OBSERVACIONES: 'badge status-con-observaciones',
    EN_CORRECCION: 'badge status-en-correccion',
    REENVIADO: 'badge status-reenviado',
    VALIDADO: 'badge status-validado',
    CERRADO: 'badge status-cerrado',
    BLOQUEADO: 'badge status-bloqueado',
    REABIERTO: 'badge status-reabierto',
  };
  return map[status] || 'badge';
}

export function semaforo(pct: number): { color: string; dot: string } {
  if (pct >= 80) return { color: 'text-green-600', dot: 'bg-green-500' };
  if (pct >= 40) return { color: 'text-amber-600', dot: 'bg-amber-500' };
  return { color: 'text-red-600', dot: 'bg-red-500' };
}

export function progressColor(pct: number): string {
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 40) return 'bg-amber-500';
  return 'bg-red-400';
}

export function roleLabel(role: string): string {
  const map: Record<string, string> = {
    SUPER_ADMIN: 'Super Administrador',
    ADMIN_ASIGNADOR: 'Admin Asignador',
    ADMINISTRADOR: 'Administrador',
    COORDINADOR: 'Coordinador',
    REVISOR_SENIOR: 'Revisor Senior',
    REVISOR: 'Revisor',
    AJUSTADOR: 'Ajustador',
  };
  return map[role] || role;
}

export function roleBadgeColor(role: UserRole): string {
  const map: Record<UserRole, string> = {
    SUPER_ADMIN: 'bg-purple-100 text-purple-700',
    ADMIN_ASIGNADOR: 'bg-orange-100 text-orange-700',
    ADMINISTRADOR: 'bg-blue-100 text-blue-700',
    COORDINADOR: 'bg-cyan-100 text-cyan-700',
    REVISOR_SENIOR: 'bg-indigo-100 text-indigo-700',
    REVISOR: 'bg-slate-100 text-slate-700',
    AJUSTADOR: 'bg-green-100 text-green-700',
  };
  return map[role] || 'bg-gray-100 text-gray-700';
}

export function slotLabel(slot: string): string {
  const map: Record<string, string> = {
    FRONTAL_IZQ: 'Frontal Izquierda',
    FRONTAL_DER: 'Frontal Derecha',
    TRASERA_IZQ: 'Trasera Izquierda',
    TRASERA_DER: 'Trasera Derecha',
  };
  return map[slot] || slot;
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

export function formatDateShort(iso: string | undefined): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(iso));
}

/** Puede ver expedientes ajenos (revisor, admin, asignador) */
export function isRevisor(role: string): boolean {
  return ['SUPER_ADMIN', 'ADMINISTRADOR', 'COORDINADOR', 'REVISOR_SENIOR', 'REVISOR'].includes(role);
}

/** Puede crear expedientes y asignar adjuster */
export function canAssign(role: string): boolean {
  return ['SUPER_ADMIN', 'ADMIN_ASIGNADOR', 'ADMINISTRADOR', 'COORDINADOR'].includes(role);
}

/** Puede cerrar expedientes */
export function canClose(role: string): boolean {
  return ['SUPER_ADMIN', 'ADMINISTRADOR', 'COORDINADOR', 'REVISOR_SENIOR'].includes(role);
}

/** El expediente pertenece al adjuster (fue asignado a él) */
export function isMyExpediente(exp: { assigned_to?: string; created_by: string }, userId: string): boolean {
  return exp.assigned_to === userId || exp.created_by === userId;
}

export function prioridadLabel(p: string): string {
  return { NORMAL: 'Normal', URGENTE: 'Urgente', CATASTROFE: 'Catástrofe' }[p] || p;
}

export function prioridadClass(p: string): string {
  return {
    NORMAL: 'badge bg-gray-100 text-gray-600',
    URGENTE: 'badge bg-orange-100 text-orange-700',
    CATASTROFE: 'badge bg-red-100 text-red-700',
  }[p] || 'badge';
}

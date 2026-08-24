import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store';
import {
  CATALOGO_COMPONENTES, BLOQUES,
  type Expediente, type ComponenteInstance, type Evidencia, type EvidenciaStatus
} from '@/types';
import {
  evidenciaBadgeClass, statusLabel, expedienteStatusClass, expedienteStatusLabel,
  semaforo, progressColor, slotLabel, formatDate, formatDateShort, isRevisor,
  canClose, canAssign, prioridadClass, prioridadLabel
} from '@/utils/helpers';
import {
  ArrowLeft, Camera, Upload, ChevronDown, ChevronUp, CheckCircle,
  AlertCircle, XCircle, Clock, Eye, FileText, Image as ImageIcon, RefreshCw,
  Send, Lock, MoreHorizontal, Ban, Info, Check, Download, MapPin, Radio,
  Car, Zap, UserCheck, Phone, Navigation, Edit
} from 'lucide-react';

// ================================================================
// Vista de Expediente — Integrador con Despacho de Central
// ================================================================

// ---- Ficha de Asignación de Central & Reporte ----
function DispatchCard({ exp }: { exp: Expediente }) {
  const { currentUser, users, iniciarIntegracion, assignExpediente, getAdjusters } = useStore();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newAdjuster, setNewAdjuster] = useState(exp.assigned_to || '');
  const [notes, setNotes] = useState(exp.assignment_notes || '');

  const assignedAdjuster = users.find(u => u.id === exp.assigned_to);
  const assignerUser = users.find(u => u.id === exp.assigned_by || u.id === exp.created_by);
  const isAssigner = canAssign(currentUser?.role || '');
  const isMyAssignedClaim = exp.assigned_to === currentUser?.id;
  const isAsignado = exp.status === 'ASIGNADO';
  const adjusters = getAdjusters();

  const handleReassign = () => {
    if (!newAdjuster) return;
    assignExpediente(exp.id, newAdjuster, notes);
    setShowAssignModal(false);
  };

  return (
    <div className="card p-4 lg:p-5 border-l-4 border-l-azul-darey space-y-4">
      {/* Top Banner if new assignment */}
      {isAsignado && isMyAssignedClaim && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap shadow-md">
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6 animate-pulse text-white shrink-0" />
            <div>
              <div className="font-bold text-sm">Siniestro asignado a ti por la Central</div>
              <div className="text-xs text-white/80">Revisa los datos del reporte, acude a la ubicación y presiona iniciar.</div>
            </div>
          </div>
          <button
            onClick={() => iniciarIntegracion(exp.id)}
            className="px-4 py-2 bg-white text-violet-700 font-bold text-xs rounded-lg hover:bg-gray-100 transition-all shadow shrink-0 flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" /> Llegué a la escena / Iniciar integración
          </button>
        </div>
      )}

      {/* Grid of Report & Dispatch Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Col 1: Ubicación & Maps */}
        <div className="space-y-2 bg-bg-subtle p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" /> Ubicación del Siniestro
            </span>
            {exp.reporte?.prioridad && (
              <span className={prioridadClass(exp.reporte.prioridad)}>
                <Zap className="w-3 h-3 inline mr-0.5" />
                {prioridadLabel(exp.reporte.prioridad)}
              </span>
            )}
          </div>
          <div className="font-semibold text-sm text-carbon leading-snug">
            {exp.reporte?.ubicacion_siniestro || 'Ubicación pendiente'}
          </div>
          {exp.reporte?.ubicacion_siniestro && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(exp.reporte.ubicacion_siniestro)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-azul-darey hover:underline pt-1"
            >
              <Navigation className="w-3.5 h-3.5" /> Abrir en Google Maps / GPS
            </a>
          )}
        </div>

        {/* Col 2: Datos del reporte de seguro */}
        <div className="space-y-2 bg-bg-subtle p-3 rounded-xl">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Car className="w-3.5 h-3.5 text-azul-darey" /> Datos del Reporte de Aseguradora
          </span>
          <div className="text-xs space-y-1">
            <div><strong>Vehículo:</strong> {exp.vehiculo_asegurado.placas} · {exp.vehiculo_asegurado.color || ''} {exp.vehiculo_asegurado.marca || ''} {exp.vehiculo_asegurado.modelo || ''}</div>
            <div>
              <strong>Asegurado:</strong> {exp.asegurado.nombre}
              {exp.asegurado.telefono && (
                <a
                  href={`tel:${exp.asegurado.telefono}`}
                  className="inline-flex items-center gap-1 text-azul-darey font-bold ml-1.5 px-2 py-0.5 bg-white rounded border border-azul-darey/30 hover:bg-azul-darey hover:text-white transition-all shadow-xs"
                >
                  <Phone className="w-3 h-3" /> Llamar: {exp.asegurado.telefono}
                </a>
              )}
            </div>
            {exp.reporte?.numero_reporte && <div><strong>Folio Reporte:</strong> {exp.reporte.numero_reporte}</div>}
            {exp.reporte?.contacto_aseguradora && <div><strong>Contacto Aseguradora:</strong> {exp.reporte.contacto_aseguradora}</div>}
          </div>
        </div>

        {/* Col 3: Asignación & Despacho */}
        <div className="space-y-2 bg-bg-subtle p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-azul-profundo" /> Despacho de Central
            </span>
            {isAssigner && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="text-[11px] font-semibold text-azul-darey hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" /> Reasignar
              </button>
            )}
          </div>
          <div className="text-xs space-y-1">
            <div>
              <strong>Ajustador asignado:</strong>{' '}
              <span className="font-bold text-azul-profundo">
                {assignedAdjuster ? `${assignedAdjuster.username} (${assignedAdjuster.name})` : 'Sin asignar'}
              </span>
            </div>
            {assignerUser && (
              <div className="text-[11px] text-text-muted">
                Asignado por: {assignerUser.username} · {formatDateShort(exp.assigned_at || exp.fecha_apertura)}
              </div>
            )}
            {exp.assignment_notes && (
              <div className="text-[11px] bg-white p-2 rounded-lg border border-gray-100 text-carbon mt-1">
                <strong>Instrucciones Central:</strong> {exp.assignment_notes}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Reasignar */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-carbon flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-azul-darey" /> Reasignar Ajustador
            </h3>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase">Seleccionar Ajustador *</label>
              <select
                className="input-darey"
                value={newAdjuster}
                onChange={e => setNewAdjuster(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {adjusters.map(a => (
                  <option key={a.id} value={a.id}>{a.username} — {a.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase">Notas o Instrucciones</label>
              <textarea
                className="input-darey resize-none"
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Instrucciones para el nuevo ajustador..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setShowAssignModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleReassign}>Guardar Asignación</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Header del expediente ----
function ExpedienteHeader({ exp }: { exp: Expediente }) {
  const { currentUser, sendToReview, closeExpediente } = useStore();
  const sf = semaforo(exp.integration_percent);
  const sfV = semaforo(exp.validation_percent);
  const canReview = isRevisor(currentUser?.role || '');
  const canCloseExp = canClose(currentUser?.role || '');
  const isOwnerOrAssigned = exp.created_by === currentUser?.id || exp.assigned_to === currentUser?.id;
  const isLocked = ['CERRADO', 'BLOQUEADO'].includes(exp.status);

  const handleSendReview = () => {
    if (window.confirm('¿Enviar expediente a revisión?')) {
      sendToReview(exp.id);
    }
  };

  const handleClose = () => {
    if (exp.validation_percent < 100) {
      alert('No se puede cerrar: quedan componentes obligatorios sin validar.');
      return;
    }
    if (window.confirm('¿Cerrar y bloquear este expediente? Esta acción no se puede deshacer.')) {
      closeExpediente(exp.id);
    }
  };

  return (
    <div className="card p-4 lg:p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-2xl font-bold text-carbon">#{exp.numero_siniestro}</span>
            <span className={expedienteStatusClass(exp.status)}>{expedienteStatusLabel(exp.status)}</span>
            {exp.observaciones_abiertas > 0 && (
              <span className="badge badge-observada">
                <AlertCircle className="w-3 h-3" /> {exp.observaciones_abiertas} observaciones
              </span>
            )}
            {isLocked && <span className="badge badge-rechazada"><Lock className="w-3 h-3" /> Bloqueado</span>}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-text-muted">
            <span><strong>Asegurado:</strong> {exp.asegurado.nombre}</span>
            <span><strong>Placas:</strong> {exp.vehiculo_asegurado.placas}</span>
            <span><strong>Aseguradora:</strong> {exp.aseguradora}</span>
            <span><strong>Siniestro:</strong> {formatDateShort(exp.fecha_siniestro)} {exp.hora_siniestro || ''}</span>
            {exp.tiene_tercero && <span className="text-azul-darey font-semibold">Con tercero</span>}
          </div>
        </div>

        {/* Actions */}
        {!isLocked && (
          <div className="flex items-center gap-2 flex-wrap">
            {(isOwnerOrAssigned || canReview) && ['BORRADOR', 'ASIGNADO', 'EN_INTEGRACION', 'CON_OBSERVACIONES', 'EN_CORRECCION'].includes(exp.status) && (
              <button onClick={handleSendReview} className="btn-primary text-sm">
                <Send className="w-4 h-4" /> Enviar a revisión
              </button>
            )}
            {canCloseExp && exp.status === 'VALIDADO' && (
              <button onClick={handleClose} className="btn-success text-sm">
                <Lock className="w-4 h-4" /> Cerrar expediente
              </button>
            )}
            {['CERRADO', 'VALIDADO'].includes(exp.status) && (
              <Link to={`/expedientes/${exp.id}/exportar`} className="btn-secondary text-sm">
                <Download className="w-4 h-4" /> Exportar PDF
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Progress bars */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-text-muted">% INTEGRACIÓN</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${sf.dot}`} />
              <span className={`text-base font-bold ${sf.color}`}>{exp.integration_percent}%</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className={`progress-fill ${progressColor(exp.integration_percent)}`} style={{ width: `${exp.integration_percent}%` }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-text-muted">% VALIDACIÓN</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${sfV.dot}`} />
              <span className={`text-base font-bold ${sfV.color}`}>{exp.validation_percent}%</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className={`progress-fill ${progressColor(exp.validation_percent)}`} style={{ width: `${exp.validation_percent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Slot de evidencia (esquinas o individual) ----
function EvidenciaSlot({
  evidencia, compId, expId, slot, isLocked, canValidate
}: {
  evidencia: Evidencia | undefined;
  compId: number;
  expId: string;
  slot?: string;
  isLocked: boolean;
  canValidate: boolean;
}) {
  const { uploadEvidencia, validateEvidencia } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showActions, setShowActions] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState<'VALIDAR' | 'OBSERVAR' | 'RECHAZAR' | null>(null);
  const [comentario, setComentario] = useState('');

  const currentVersion = evidencia?.versions[evidencia.current_version - 1];
  const isImage = currentVersion?.file_type?.startsWith('image/');
  const status: EvidenciaStatus = evidencia?.status || 'PENDIENTE';

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadEvidencia(expId, compId, file, slot);
    e.target.value = '';
  };

  const handleValidate = () => {
    if (!evidencia || !showValidateModal) return;
    validateEvidencia(expId, compId, evidencia.id, showValidateModal, comentario);
    setShowValidateModal(null);
    setComentario('');
  };

  const slotBorderClass = {
    PENDIENTE: '',
    CARGADA: 'filled',
    EN_REVISION: 'filled',
    OBSERVADA: 'observada',
    RECHAZADA: 'rechazada',
    VALIDADA: 'validada',
    NO_APLICA: 'filled',
    SUSTITUIDA: 'filled',
  }[status] || '';

  return (
    <>
      <div className={`slot-card ${slotBorderClass} p-2`} onClick={() => !isLocked && fileRef.current?.click()}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFile}
          capture="environment"
        />

        {/* Thumbnail */}
        {currentVersion && isImage ? (
          <div className="relative w-full h-24 mb-2">
            <img
              src={currentVersion.file_url}
              alt={currentVersion.file_name}
              className="w-full h-full object-cover rounded-lg"
            />
            {evidencia && evidencia.versions.length > 1 && (
              <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                v{evidencia.current_version}
              </span>
            )}
          </div>
        ) : currentVersion ? (
          <div className="flex items-center justify-center w-full h-24 mb-2 bg-azul-darey/5 rounded-lg">
            <div className="text-center">
              <FileText className="w-8 h-8 text-azul-darey mx-auto" />
              <div className="text-[10px] text-text-muted mt-1 truncate max-w-[80px]">{currentVersion.file_name}</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-24 mb-2 opacity-50">
            {slot ? (
              <>
                <Camera className="w-8 h-8 text-gray-400" />
                <span className="text-[10px] text-text-muted mt-1 text-center">{slotLabel(slot)}</span>
              </>
            ) : (
              <>
                <Upload className="w-7 h-7 text-gray-400" />
                <span className="text-[10px] text-text-muted mt-1">Cargar</span>
              </>
            )}
          </div>
        )}

        {/* Status badge */}
        <div onClick={e => e.stopPropagation()} className="flex items-center justify-between w-full">
          <span className={evidenciaBadgeClass(status)}>{statusLabel(status)}</span>
          {currentVersion && !isLocked && (
            <button
              className="p-1 hover:bg-gray-100 rounded-full text-text-muted"
              onClick={(e) => { e.stopPropagation(); setShowActions(v => !v); }}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Actions dropdown */}
        {showActions && currentVersion && (
          <div
            className="absolute bottom-full right-0 mb-1 bg-white border border-gray-100 rounded-xl shadow-xl z-20 min-w-[180px] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-bg-subtle text-carbon"
              onClick={() => { setShowActions(false); fileRef.current?.click(); }}>
              <RefreshCw className="w-3.5 h-3.5 text-azul-darey" /> Nueva versión
            </button>
            {canValidate && evidencia && ['CARGADA', 'EN_REVISION'].includes(status) && (
              <>
                <div className="border-t border-gray-100 my-1" />
                <button className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-green-50 text-green-700"
                  onClick={() => { setShowActions(false); setShowValidateModal('VALIDAR'); }}>
                  <Check className="w-3.5 h-3.5" /> Validar
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-amber-50 text-amber-700"
                  onClick={() => { setShowActions(false); setShowValidateModal('OBSERVAR'); }}>
                  <AlertCircle className="w-3.5 h-3.5" /> Observar
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-red-50 text-red-700"
                  onClick={() => { setShowActions(false); setShowValidateModal('RECHAZAR'); }}>
                  <XCircle className="w-3.5 h-3.5" /> Rechazar
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Validate Modal */}
      {showValidateModal && (
        <div className="modal-overlay" onClick={() => setShowValidateModal(null)}>
          <div className="modal-content p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-carbon flex items-center gap-2">
              {showValidateModal === 'VALIDAR' && <><CheckCircle className="w-5 h-5 text-green-600" /> Validar evidencia</>}
              {showValidateModal === 'OBSERVAR' && <><AlertCircle className="w-5 h-5 text-amber-600" /> Observar evidencia</>}
              {showValidateModal === 'RECHAZAR' && <><XCircle className="w-5 h-5 text-red-600" /> Rechazar evidencia</>}
            </h3>
            <textarea
              className="input-darey resize-none"
              rows={3}
              placeholder={showValidateModal === 'VALIDAR' ? 'Comentario opcional...' : 'Describe el motivo de la observación/rechazo...'}
              value={comentario}
              onChange={e => setComentario(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setShowValidateModal(null)}>Cancelar</button>
              <button
                className={showValidateModal === 'VALIDAR' ? 'btn-success' : showValidateModal === 'OBSERVAR' ? 'btn-warning' : 'btn-danger'}
                onClick={handleValidate}
              >
                {showValidateModal === 'VALIDAR' ? 'Validar' : showValidateModal === 'OBSERVAR' ? 'Observar' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---- Componente individual ----
function ComponenteCard({
  comp, instance, expId, isLocked, canValidate
}: {
  comp: typeof CATALOGO_COMPONENTES[0];
  instance: ComponenteInstance;
  expId: string;
  isLocked: boolean;
  canValidate: boolean;
}) {
  const { uploadEvidencia, requestNoAplica } = useStore();
  const [showNoAplica, setShowNoAplica] = useState(false);
  const [noAplicaCausa, setNoAplicaCausa] = useState('');
  const [noAplicaComentario, setNoAplicaComentario] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const hasSlots = !!comp.slots;
  const activeEvidencias = instance.evidencias.filter(e => e.status !== 'SUSTITUIDA');

  let compStatus: 'PENDIENTE' | 'PARCIAL' | 'COMPLETO' | 'VALIDADO' | 'OBSERVADO' = 'PENDIENTE';
  if (instance.no_aplica?.estado === 'APROBADO') compStatus = 'VALIDADO';
  else if (activeEvidencias.some(e => e.status === 'OBSERVADA' || e.status === 'RECHAZADA')) compStatus = 'OBSERVADO';
  else if (activeEvidencias.length > 0 && activeEvidencias.every(e => e.status === 'VALIDADA')) compStatus = 'VALIDADO';
  else if (activeEvidencias.length > 0) compStatus = 'PARCIAL';

  const compStatusColor = {
    PENDIENTE: 'text-gray-400',
    PARCIAL: 'text-amber-500',
    COMPLETO: 'text-blue-500',
    VALIDADO: 'text-green-600',
    OBSERVADO: 'text-red-500',
  }[compStatus];

  const CompIcon = {
    PENDIENTE: Clock,
    PARCIAL: RefreshCw,
    COMPLETO: CheckCircle,
    VALIDADO: CheckCircle,
    OBSERVADO: AlertCircle,
  }[compStatus];

  const handleNoAplica = () => {
    if (!noAplicaCausa) { alert('Debes seleccionar una causa'); return; }
    requestNoAplica(expId, comp.id, noAplicaCausa, noAplicaComentario);
    setShowNoAplica(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadEvidencia(expId, comp.id, file);
    e.target.value = '';
  };

  if (instance.no_aplica?.estado === 'APROBADO') {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
        <Ban className="w-5 h-5 text-slate-400 shrink-0" />
        <div className="flex-1">
          <div className="font-semibold text-sm text-carbon">{comp.nombre}</div>
          <div className="text-xs text-text-muted">NO APLICA — {instance.no_aplica.causa}</div>
        </div>
        <span className="badge badge-no-aplica">No aplica</span>
      </div>
    );
  }

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center bg-white border-2 ${compStatus === 'VALIDADO' ? 'border-green-500' : compStatus === 'OBSERVADO' ? 'border-red-400' : 'border-gray-200'}`}>
            <CompIcon className={`w-3 h-3 ${compStatusColor}`} />
          </div>
          <span className="font-semibold text-sm text-carbon">{comp.nombre}</span>
          <span className="text-[10px] text-text-muted hidden sm:block">{comp.descripcion}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {comp.puede_no_aplica && !isLocked && instance.evidencias.every(e => e.status === 'PENDIENTE') && (
            <button
              className="text-[11px] text-text-muted border border-dashed border-gray-300 rounded-full px-2.5 py-1 hover:border-azul-darey hover:text-azul-darey transition-colors"
              onClick={() => setShowNoAplica(true)}
            >
              <Ban className="w-3 h-3 inline mr-1" /> No aplica
            </button>
          )}
          {instance.no_aplica && instance.no_aplica.estado === 'PENDIENTE' && (
            <span className="badge badge-en-revision text-[10px]">
              <Clock className="w-3 h-3" /> No aplica (pendiente)
            </span>
          )}
        </div>
      </div>

      {/* Slots (4 esquinas) */}
      {hasSlots && comp.slots && (
        <div className="grid grid-cols-2 gap-2 relative">
          {comp.slots.map(slot => {
            const ev = instance.evidencias.find(e => e.slot === slot);
            return (
              <div key={slot} className="relative">
                <div className="text-[10px] text-text-muted text-center mb-1 font-medium">{slotLabel(slot)}</div>
                <EvidenciaSlot
                  evidencia={ev}
                  compId={comp.id}
                  expId={expId}
                  slot={slot}
                  isLocked={isLocked}
                  canValidate={canValidate}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Evidencias sin slot */}
      {!hasSlots && (
        <div className="space-y-2">
          {instance.evidencias.filter(e => e.status !== 'SUSTITUIDA').map(ev => (
            <div key={ev.id} className="relative">
              <EvidenciaSlot
                evidencia={ev}
                compId={comp.id}
                expId={expId}
                isLocked={isLocked}
                canValidate={canValidate}
              />
            </div>
          ))}

          {!isLocked && (comp.max_evidencias === null || instance.evidencias.length < comp.max_evidencias) && (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileUpload}
                capture="environment"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-azul-darey/30 rounded-xl py-2.5 text-xs font-semibold text-azul-darey hover:bg-azul-darey/5 hover:border-azul-darey transition-all"
                >
                  <Camera className="w-4 h-4" /> Capturar foto
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-text-muted hover:bg-bg-subtle transition-all"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No aplica modal */}
      {showNoAplica && (
        <div className="modal-overlay" onClick={() => setShowNoAplica(false)}>
          <div className="modal-content p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-carbon flex items-center gap-2">
              <Ban className="w-5 h-5 text-slate-500" /> Solicitar "No Aplica"
            </h3>
            <p className="text-sm text-text-muted">
              <strong>{comp.nombre}</strong> — Esta solicitud será enviada al revisor para su aprobación.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase">Causa *</label>
              <select className="input-darey" value={noAplicaCausa} onChange={e => setNoAplicaCausa(e.target.value)}>
                <option value="">Seleccionar causa...</option>
                <option value="Sin lesionados">Sin lesionados</option>
                <option value="Sin tercero involucrado">Sin tercero involucrado</option>
                <option value="Sin orden de taller">Sin orden de taller</option>
                <option value="Sin daños físicos a vehículo tercero">Sin daños físicos a vehículo tercero</option>
                <option value="Robo sin tercero">Robo sin tercero</option>
                <option value="Pérdida total">Pérdida total</option>
                <option value="Otra">Otra</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase">Comentario adicional</label>
              <textarea className="input-darey resize-none" rows={2} value={noAplicaComentario} onChange={e => setNoAplicaComentario(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setShowNoAplica(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleNoAplica}>Solicitar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Bloque colapsable ----
function BloqueSection({
  bloque, expId, componentes, isLocked, canValidate
}: {
  bloque: typeof BLOQUES[0];
  expId: string;
  componentes: ComponenteInstance[];
  isLocked: boolean;
  canValidate: boolean;
}) {
  const [open, setOpen] = useState(true);

  const bComps = CATALOGO_COMPONENTES.filter(c => c.bloque === bloque.id);
  const totalSlots = bComps.reduce((acc, c) => {
    if (c.slots) return acc + c.slots.length;
    return acc + 1;
  }, 0);
  const filledSlots = componentes.filter(inst => {
    const bComp = bComps.find(c => c.id === inst.component_id);
    if (!bComp) return false;
    if (inst.no_aplica?.estado === 'APROBADO') return true;
    return inst.evidencias.some(e => e.status !== 'PENDIENTE' && e.versions.length > 0);
  }).length;

  const validatedSlots = componentes.filter(inst => {
    const bComp = bComps.find(c => c.id === inst.component_id);
    if (!bComp) return false;
    if (inst.no_aplica?.estado === 'APROBADO') return true;
    return inst.evidencias.length > 0 && inst.evidencias.every(e => e.status === 'VALIDADA');
  }).length;

  const pctFill = totalSlots > 0 ? Math.round(filledSlots / bComps.length * 100) : 0;

  return (
    <div id={`bloque-${bloque.id}`} className="card overflow-hidden scroll-mt-24">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-subtle transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-azul-profundo/10 flex items-center justify-center shrink-0">
            <span className="text-azul-profundo font-bold text-sm">{bloque.id}</span>
          </div>
          <div>
            <div className="font-semibold text-carbon text-sm">{bloque.nombre}</div>
            <div className="text-xs text-text-muted">
              {filledSlots}/{bComps.length} cargados · {validatedSlots}/{bComps.length} validados
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-24 hidden sm:block">
            <div className="progress-bar">
              <div className={`progress-fill ${progressColor(pctFill)}`} style={{ width: `${pctFill}%` }} />
            </div>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-50">
          {bComps.map(comp => {
            const instance = componentes.find(c => c.component_id === comp.id);
            if (!instance) return null;
            return (
              <div key={comp.id} className="pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-azul-darey/10 text-azul-darey text-[10px] font-bold flex items-center justify-center shrink-0">
                    {comp.id}
                  </span>
                  <ComponenteCard
                    key={comp.id}
                    comp={comp}
                    instance={instance}
                    expId={expId}
                    isLocked={isLocked}
                    canValidate={canValidate}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ================================================================
// MAIN — ExpedienteDetail
// ================================================================

export default function ExpedienteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, expedientes, iniciarIntegracion, sendToReview } = useStore();
  const [tab, setTab] = useState<'integrador' | 'datos' | 'historial'>('integrador');

  const exp = expedientes.find(e => e.id === id);
  if (!exp) return (
    <div className="p-6 text-center text-text-muted">
      <p className="text-lg font-semibold">Expediente no encontrado</p>
      <button onClick={() => navigate('/expedientes')} className="btn-primary mt-4">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>
    </div>
  );

  const isLocked = ['CERRADO', 'BLOQUEADO'].includes(exp.status);
  const canValidate = isRevisor(currentUser?.role || '') && exp.assigned_to !== currentUser?.id;

  const relevantComponetes = exp.componentes.filter(comp => {
    const catalog = CATALOGO_COMPONENTES.find(c => c.id === comp.component_id);
    if (!catalog) return false;
    if (catalog.bloque === 5 && !exp.tiene_tercero) return false;
    return true;
  });

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fadeIn pb-28 lg:pb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <button onClick={() => navigate('/expedientes')} className="hover:text-azul-darey transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Expedientes
        </button>
        <span>/</span>
        <span className="text-carbon font-semibold">#{exp.numero_siniestro}</span>
      </div>

      {/* Ficha de Despacho & Asignación Central */}
      <DispatchCard exp={exp} />

      {/* Header card */}
      <ExpedienteHeader exp={exp} />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 overflow-x-auto no-scrollbar">
        {(['integrador', 'datos', 'historial'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors capitalize border-b-2 -mb-px whitespace-nowrap shrink-0 ${
              tab === t ? 'border-azul-darey text-azul-darey' : 'border-transparent text-text-muted hover:text-carbon'
            }`}
          >
            {t === 'integrador' ? '📋 Integrador de Evidencias' : t === 'datos' ? '📄 Reporte & Datos' : '📅 Historial'}
          </button>
        ))}
      </div>

      {/* Selector Rápido de Bloques (Mobile-friendly jump bar) */}
      {tab === 'integrador' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar -mx-1 px-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider shrink-0 hidden sm:inline">
            Ir a:
          </span>
          {BLOQUES.filter(b => b.id !== 5 || exp.tiene_tercero).map(b => (
            <a
              key={b.id}
              href={`#bloque-${b.id}`}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-carbon whitespace-nowrap shadow-xs hover:border-azul-darey hover:text-azul-darey transition-all shrink-0 flex items-center gap-1.5"
            >
              <span className="w-4 h-4 rounded-full bg-azul-darey/10 text-azul-darey text-[10px] flex items-center justify-center font-bold">
                {b.id}
              </span>
              <span>Bloque {b.id}</span>
            </a>
          ))}
        </div>
      )}

      {/* Tab content */}
      {tab === 'integrador' && (
        <div className="space-y-3">
          {!exp.tiene_tercero && (
            <div className="alert-info text-xs">
              <Info className="w-4 h-4 shrink-0" />
              Bloque 5 (Evidencia del Tercero) excluido — no hay tercero registrado en este siniestro.
            </div>
          )}
          {isLocked && (
            <div className="alert-warning text-xs">
              <Lock className="w-4 h-4 shrink-0" />
              Expediente cerrado y bloqueado. No se pueden realizar modificaciones.
            </div>
          )}
          {BLOQUES.filter(b => b.id !== 5 || exp.tiene_tercero).map(bloque => {
            const bInsts = relevantComponetes.filter(c => {
              const cat = CATALOGO_COMPONENTES.find(cc => cc.id === c.component_id);
              return cat?.bloque === bloque.id;
            });
            return (
              <BloqueSection
                key={bloque.id}
                bloque={bloque}
                expId={exp.id}
                componentes={bInsts}
                isLocked={isLocked}
                canValidate={canValidate}
              />
            );
          })}
        </div>
      )}

      {tab === 'datos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-carbon border-b border-gray-100 pb-2">Reporte de Aseguradora</h3>
            {[
              ['Número de siniestro', exp.numero_siniestro],
              ['Fecha del siniestro', formatDateShort(exp.fecha_siniestro)],
              ['Hora del siniestro', exp.hora_siniestro || '—'],
              ['Aseguradora', exp.aseguradora],
              ['Folio Reporte Aseguradora', exp.reporte?.numero_reporte || '—'],
              ['Póliza', exp.poliza],
              ['Folio DUA', exp.folio_dua],
              ['Prioridad', exp.reporte?.prioridad || 'NORMAL'],
              ['Ubicación', exp.reporte?.ubicacion_siniestro || '—'],
              ['Contacto aseguradora', exp.reporte?.contacto_aseguradora || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm gap-2">
                <span className="text-text-muted">{k}</span>
                <span className="font-medium text-right">{v || '—'}</span>
              </div>
            ))}
          </div>

          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-carbon border-b border-gray-100 pb-2">Vehículo Asegurado</h3>
            {[
              ['Placas', exp.vehiculo_asegurado.placas],
              ['Color', exp.vehiculo_asegurado.color || '—'],
              ['Marca / Modelo', `${exp.vehiculo_asegurado.marca || ''} ${exp.vehiculo_asegurado.modelo || ''}`],
              ['Año', exp.vehiculo_asegurado.año || '—'],
              ['VIN / Serie', exp.vehiculo_asegurado.vin || 'Pendiente en campo'],
              ['Titular / Asegurado', exp.asegurado.nombre],
              ['Teléfono', exp.asegurado.telefono || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm gap-2">
                <span className="text-text-muted">{k}</span>
                <span className="font-medium text-right">{v || '—'}</span>
              </div>
            ))}
          </div>

          {exp.tiene_tercero && (
            <div className="card p-5 space-y-3">
              <h3 className="font-semibold text-carbon border-b border-gray-100 pb-2">Vehículo / Conductor Tercero</h3>
              {[
                ['Nombre', exp.tercero?.nombre || 'Por confirmar en campo'],
                ['Teléfono', exp.tercero?.telefono || '—'],
                ['Placas', exp.vehiculo_tercero?.placas || 'Por confirmar en campo'],
                ['Color', exp.vehiculo_tercero?.color || '—'],
                ['Marca / Modelo', `${exp.vehiculo_tercero?.marca || ''} ${exp.vehiculo_tercero?.modelo || ''}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm gap-2">
                  <span className="text-text-muted">{k}</span>
                  <span className="font-medium text-right">{v || '—'}</span>
                </div>
              ))}
            </div>
          )}

          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-carbon border-b border-gray-100 pb-2">Asignación & Tiempos</h3>
            {[
              ['Estado actual', expedienteStatusLabel(exp.status)],
              ['Apertura en central', formatDate(exp.fecha_apertura)],
              ['Asignado a', exp.assigned_to || 'Sin asignar'],
              ['Fecha de asignación', formatDate(exp.assigned_at)],
              ['Envío a revisión', formatDate(exp.submitted_at)],
              ['Validado', formatDate(exp.validated_at)],
              ['Cerrado', formatDate(exp.closed_at)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm gap-2">
                <span className="text-text-muted">{k}</span>
                <span className="font-medium text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'historial' && (
        <div className="card p-5">
          <h3 className="font-semibold text-carbon mb-4">Historial de acciones y auditoría</h3>
          <div className="text-center py-8 text-text-muted text-sm">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            Las acciones registradas para el siniestro #{exp.numero_siniestro} están protegidas en la bitácora de auditoría.
          </div>
        </div>
      )}

      {/* Mobile Floating Action Bar (Optimizado para campo) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 z-30 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-azul-darey text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {exp.integration_percent}%
          </div>
          <div className="text-[11px] leading-tight">
            <div className="font-bold text-carbon">Integración</div>
            <div className="text-text-muted">{expedienteStatusLabel(exp.status)}</div>
          </div>
        </div>

        {exp.status === 'ASIGNADO' && exp.assigned_to === currentUser?.id ? (
          <button
            onClick={() => iniciarIntegracion(exp.id)}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow"
          >
            <CheckCircle className="w-4 h-4" /> Iniciar Integración
          </button>
        ) : (!isLocked && (exp.assigned_to === currentUser?.id || isRevisor(currentUser?.role || '')) && ['BORRADOR', 'EN_INTEGRACION', 'CON_OBSERVACIONES', 'EN_CORRECCION'].includes(exp.status)) ? (
          <button
            onClick={() => {
              if (window.confirm('¿Enviar expediente a revisión?')) {
                sendToReview(exp.id);
              }
            }}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow"
          >
            <Send className="w-4 h-4" /> Enviar a revisión
          </button>
        ) : null}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store';
import { expedienteStatusClass, expedienteStatusLabel, formatDate, formatDateShort, progressColor, semaforo } from '@/utils/helpers';
import { ClipboardList, Eye, Clock, AlertCircle, RefreshCw } from 'lucide-react';

// ================================================================
// Cola de revisión — para revisores
// ================================================================

export default function ColaRevision() {
  const { expedientes, currentUser, users } = useStore();
  const [sort, setSort] = useState<'date' | 'status'>('date');

  const pendientes = expedientes.filter(e =>
    ['LISTO_PARA_REVISION', 'EN_REVISION', 'REENVIADO'].includes(e.status)
  ).sort((a, b) => {
    if (sort === 'date') return new Date(a.submitted_at || '').getTime() - new Date(b.submitted_at || '').getTime();
    return a.status.localeCompare(b.status);
  });

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-carbon">Cola de Revisión</h1>
          <p className="text-sm text-text-muted">{pendientes.length} expedientes pendientes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSort('date')} className={`btn-${sort === 'date' ? 'primary' : 'secondary'} text-xs`}>
            <Clock className="w-3.5 h-3.5" /> Por antigüedad
          </button>
          <button onClick={() => setSort('status')} className={`btn-${sort === 'status' ? 'primary' : 'secondary'} text-xs`}>
            Por estado
          </button>
        </div>
      </div>

      {pendientes.length === 0 ? (
        <div className="card p-12 text-center text-text-muted">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-200" />
          <p className="font-semibold text-carbon">Cola vacía</p>
          <p className="text-sm mt-1">No hay expedientes pendientes de revisión.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pendientes.map(exp => {
            const owner = users.find(u => u.id === exp.created_by);
            const isReeenviado = exp.status === 'REENVIADO';
            const sf = semaforo(exp.integration_percent);
            const daysSince = exp.submitted_at
              ? Math.floor((Date.now() - new Date(exp.submitted_at).getTime()) / 86400000)
              : 0;

            return (
              <div key={exp.id} className={`card p-4 flex items-center gap-4 flex-wrap card-hover ${isReeenviado ? 'border-amber-200 bg-amber-50/30' : ''}`}>
                {isReeenviado && (
                  <div className="w-1 h-full self-stretch bg-amber-400 rounded-full -ml-4 mr-0" />
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-carbon">#{exp.numero_siniestro}</span>
                    <span className={expedienteStatusClass(exp.status)}>{expedienteStatusLabel(exp.status)}</span>
                    {daysSince > 2 && (
                      <span className="badge badge-observada">
                        <Clock className="w-3 h-3" /> {daysSince} días en cola
                      </span>
                    )}
                    {exp.observaciones_abiertas > 0 && (
                      <span className="badge badge-rechazada">
                        <AlertCircle className="w-3 h-3" /> {exp.observaciones_abiertas} obs.
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-text-muted">
                    {exp.asegurado.nombre} · {exp.vehiculo_asegurado.placas} · {exp.aseguradora}
                  </div>
                  <div className="text-xs text-text-muted">
                    Ajustador: <strong>{owner?.username || '—'}</strong> · Enviado: {formatDateShort(exp.submitted_at)}
                  </div>
                </div>
                <div className="text-right hidden sm:block space-y-1 w-36">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-text-muted">Integ.</span>
                    <div className="progress-bar flex-1">
                      <div className={`progress-fill ${progressColor(exp.integration_percent)}`} style={{ width: `${exp.integration_percent}%` }} />
                    </div>
                    <span className={`text-xs font-bold ${sf.color}`}>{exp.integration_percent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-text-muted">Valid.</span>
                    <div className="progress-bar flex-1">
                      <div className={`progress-fill ${progressColor(exp.validation_percent)}`} style={{ width: `${exp.validation_percent}%` }} />
                    </div>
                    <span className={`text-xs font-bold ${semaforo(exp.validation_percent).color}`}>{exp.validation_percent}%</span>
                  </div>
                </div>
                <Link to={`/expedientes/${exp.id}`} className="btn-primary text-sm shrink-0">
                  <Eye className="w-4 h-4" /> Revisar
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

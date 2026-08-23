import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { canAssign } from '@/utils/helpers';
import {
  ArrowLeft, Save, User, Car, Building2, AlertCircle, MapPin,
  Radio, Clock, FileText, UserCheck, Zap
} from 'lucide-react';

// ================================================================
// Nuevo Expediente — lo crea el Admin Asignador / Central
// Con datos del reporte de la agencia de seguros
// ================================================================

const ASEGURADORAS = [
  'Seguros Afirme', 'General de Seguros', 'Seguros El Águila', 'Grupo Zeus',
  'Más Soluciones', 'Movilidad Transporte Urbano & Colectivo', 'AXA Seguros',
  'Qualitas', 'GNP Seguros', 'Banorte Seguros', 'HDI Seguros', 'Otra'
];

export default function NuevoExpediente() {
  const { createExpediente, currentUser, getAdjusters } = useStore();
  const navigate = useNavigate();
  const adjusters = getAdjusters();

  const isAssigner = canAssign(currentUser?.role || '');

  const [form, setForm] = useState({
    // ---- Reporte aseguradora ----
    numero_siniestro: '',
    fecha_siniestro: new Date().toISOString().split('T')[0],
    hora_siniestro: '',
    aseguradora: '',
    poliza: '',
    folio_dua: '',
    prioridad: 'NORMAL' as 'NORMAL' | 'URGENTE' | 'CATASTROFE',
    numero_reporte: '',
    ubicacion_siniestro: '',
    descripcion_inicial: '',
    contacto_aseguradora: '',
    // ---- Asegurado ----
    asegurado_nombre: '',
    asegurado_telefono: '',
    // ---- Vehículo asegurado (llega con el reporte) ----
    va_placas: '',
    va_marca: '',
    va_modelo: '',
    va_año: '',
    va_color: '',
    va_vin: '',
    // ---- Tercero ----
    tiene_tercero: false,
    tercero_nombre: '',
    tercero_telefono: '',
    vt_placas: '',
    vt_marca: '',
    vt_modelo: '',
    vt_color: '',
    // ---- Asignación ----
    assigned_to: '',
    assignment_notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.numero_siniestro) e.numero_siniestro = 'Requerido';
    if (!form.fecha_siniestro) e.fecha_siniestro = 'Requerido';
    if (!form.aseguradora) e.aseguradora = 'Requerido';
    if (!form.ubicacion_siniestro) e.ubicacion_siniestro = 'Requerido — dato del reporte';
    if (!form.asegurado_nombre) e.asegurado_nombre = 'Requerido';
    if (!form.va_placas) e.va_placas = 'Requerido';
    if (isAssigner && !form.assigned_to) e.assigned_to = 'Debes asignar un adjuster';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const nuevo = createExpediente({
      numero_siniestro: form.numero_siniestro.toUpperCase(),
      fecha_siniestro: form.fecha_siniestro,
      hora_siniestro: form.hora_siniestro,
      aseguradora: form.aseguradora,
      poliza: form.poliza,
      folio_dua: form.folio_dua,
      reporte: {
        numero_reporte: form.numero_reporte,
        fecha_reporte: new Date().toISOString(),
        hora_siniestro: form.hora_siniestro,
        ubicacion_siniestro: form.ubicacion_siniestro,
        descripcion_inicial: form.descripcion_inicial,
        contacto_aseguradora: form.contacto_aseguradora,
        prioridad: form.prioridad,
      },
      asegurado: { nombre: form.asegurado_nombre, telefono: form.asegurado_telefono },
      vehiculo_asegurado: {
        placas: form.va_placas.toUpperCase(),
        vin: form.va_vin,
        marca: form.va_marca,
        modelo: form.va_modelo,
        año: form.va_año,
        color: form.va_color,
      },
      tiene_tercero: form.tiene_tercero,
      tercero: form.tiene_tercero ? { nombre: form.tercero_nombre, telefono: form.tercero_telefono } : undefined,
      vehiculo_tercero: form.tiene_tercero ? { placas: form.vt_placas.toUpperCase(), marca: form.vt_marca, modelo: form.vt_modelo, color: form.vt_color } : undefined,
      assigned_to: form.assigned_to || undefined,
      assigned_at: form.assigned_to ? new Date().toISOString() : undefined,
      assigned_by: currentUser?.id,
      assignment_notes: form.assignment_notes,
      status: 'ASIGNADO',
    });
    setSaving(false);
    navigate(`/expedientes/${nuevo.id}`);
  };

  const Section = ({ title, icon: Icon, subtitle, children }: {
    title: string; icon: React.ElementType; subtitle?: string; children: React.ReactNode;
  }) => (
    <div className="card p-5 space-y-4">
      <div className="flex items-start gap-2 pb-2 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-azul-darey/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-azul-darey" />
        </div>
        <div>
          <h3 className="font-semibold text-carbon">{title}</h3>
          {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, name, required, type = 'text', placeholder = '', options, half }: {
    label: string; name: string; required?: boolean; type?: string; placeholder?: string; options?: string[]; half?: boolean;
  }) => (
    <div className={`space-y-1 ${half ? '' : ''}`}>
      <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select className="input-darey" value={(form as any)[name]} onChange={e => update(name, e.target.value)}>
          <option value="">Seleccionar...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          className={`input-darey ${errors[name] ? 'border-red-300 ring-1 ring-red-200' : ''}`}
          type={type}
          placeholder={placeholder}
          value={(form as any)[name]}
          onChange={e => update(name, e.target.value)}
        />
      )}
      {errors[name] && <p className="text-xs text-red-500">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-carbon">Nuevo Expediente</h1>
          <p className="text-sm text-text-muted">Registro del reporte recibido de la aseguradora + asignación al campo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 1. DATOS DEL REPORTE (llegan de la aseguradora) */}
        <Section title="Reporte de Aseguradora" icon={Radio} subtitle="Datos que llegan con el aviso de siniestro">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Número de Siniestro" name="numero_siniestro" required placeholder="Ej. 696213" />
            <Field label="Número de Reporte / Folio Aseguradora" name="numero_reporte" placeholder="Folio interno de la aseguradora" />
            <Field label="Fecha del Siniestro" name="fecha_siniestro" required type="date" />
            <Field label="Hora del Siniestro" name="hora_siniestro" type="time" placeholder="HH:MM" />
            <Field label="Aseguradora" name="aseguradora" required options={ASEGURADORAS} />
            <Field label="Póliza" name="poliza" placeholder="Número de póliza" />
            <Field label="Folio DUA" name="folio_dua" placeholder="Ej. DUA-696213" />
            <Field label="Contacto en Aseguradora" name="contacto_aseguradora" placeholder="Nombre del ejecutivo" />

            {/* Prioridad */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Prioridad *</label>
              <div className="flex gap-2">
                {(['NORMAL', 'URGENTE', 'CATASTROFE'] as const).map(p => (
                  <button key={p} type="button"
                    onClick={() => update('prioridad', p)}
                    className={`flex-1 py-2 rounded-lg border-2 text-xs font-bold transition-all ${
                      form.prioridad === p
                        ? p === 'NORMAL' ? 'border-gray-400 bg-gray-100 text-gray-700'
                          : p === 'URGENTE' ? 'border-orange-400 bg-orange-100 text-orange-700'
                          : 'border-red-500 bg-red-100 text-red-700'
                        : 'border-gray-200 text-text-muted hover:border-gray-300'
                    }`}
                  >
                    {p === 'URGENTE' && <Zap className="w-3.5 h-3.5 inline mr-1" />}
                    {p === 'CATASTROFE' && <AlertCircle className="w-3.5 h-3.5 inline mr-1" />}
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 2. UBICACIÓN */}
        <Section title="Ubicación del Siniestro" icon={MapPin} subtitle="Dirección donde ocurrió el siniestro">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                Dirección / Descripción del lugar <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`input-darey resize-none ${errors.ubicacion_siniestro ? 'border-red-300' : ''}`}
                rows={2}
                placeholder="Ej. Av. Salvador Nava Martínez 3025, esquina con Priv. Las Torres, San Luis Potosí"
                value={form.ubicacion_siniestro}
                onChange={e => update('ubicacion_siniestro', e.target.value)}
              />
              {errors.ubicacion_siniestro && <p className="text-xs text-red-500">{errors.ubicacion_siniestro}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Descripción inicial del siniestro</label>
              <textarea
                className="input-darey resize-none"
                rows={2}
                placeholder="Descripción breve según reporte de la aseguradora..."
                value={form.descripcion_inicial}
                onChange={e => update('descripcion_inicial', e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* 3. DATOS ASEGURADO */}
        <Section title="Asegurado" icon={User} subtitle="Datos del titular de la póliza">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Nombre completo" name="asegurado_nombre" required placeholder="Nombre completo del asegurado" />
            </div>
            <Field label="Teléfono" name="asegurado_telefono" type="tel" placeholder="10 dígitos" />
          </div>
        </Section>

        {/* 4. VEHÍCULO ASEGURADO */}
        <Section title="Vehículo Asegurado" icon={Car} subtitle="Datos que llegan con el reporte de la aseguradora">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <Field label="Placas" name="va_placas" required placeholder="ABC-123" />
            </div>
            <div className="sm:col-span-1">
              <Field label="Color" name="va_color" placeholder="Ej. Blanco" />
            </div>
            <div className="sm:col-span-1">
              <Field label="Año" name="va_año" placeholder="Ej. 2023" />
            </div>
            <div className="sm:col-span-1">
              <Field label="Marca" name="va_marca" placeholder="Ej. Nissan" />
            </div>
            <div className="sm:col-span-1">
              <Field label="Modelo" name="va_modelo" placeholder="Ej. Versa" />
            </div>
            <div className="sm:col-span-1">
              <Field label="VIN / Serie" name="va_vin" placeholder="17 caracteres" />
            </div>
          </div>
          <div className="alert-info text-xs mt-1">
            <FileText className="w-4 h-4 shrink-0" />
            El adjuster validará y completará el VIN en campo al fotografiar la serie del vehículo.
          </div>
        </Section>

        {/* 5. TERCERO */}
        <div className="card p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => update('tiene_tercero', !form.tiene_tercero)}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.tiene_tercero ? 'bg-azul-darey' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.tiene_tercero ? 'translate-x-6' : ''}`} />
            </div>
            <div>
              <div className="font-semibold text-sm text-carbon">¿Involucra tercero?</div>
              <div className="text-xs text-text-muted">Activa si la aseguradora reporta vehículo o conductor tercero</div>
            </div>
          </label>
        </div>

        {form.tiene_tercero && (
          <Section title="Vehículo / Conductor Tercero" icon={Car} subtitle="Datos conocidos al momento del reporte — se completarán en campo">
            <div className="alert-warning text-xs mb-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Si los datos del tercero no son conocidos aún, el adjuster los registrará en campo.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Nombre del tercero (si se conoce)" name="tercero_nombre" placeholder="Puede quedar en blanco" />
              </div>
              <Field label="Teléfono del tercero" name="tercero_telefono" type="tel" placeholder="Si se conoce" />
              <Field label="Placas del tercero" name="vt_placas" placeholder="Si se conocen" />
              <Field label="Marca" name="vt_marca" placeholder="Si se conoce" />
              <Field label="Modelo" name="vt_modelo" placeholder="Si se conoce" />
              <Field label="Color" name="vt_color" placeholder="Si se conoce" />
            </div>
          </Section>
        )}

        {/* 6. ASIGNACIÓN */}
        {isAssigner && (
          <Section title="Asignar al Adjuster" icon={UserCheck} subtitle="Selecciona el ajustador que atenderá el siniestro en campo">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Adjuster asignado <span className="text-red-500">*</span>
                </label>
                <select
                  className={`input-darey ${errors.assigned_to ? 'border-red-300 ring-1 ring-red-200' : ''}`}
                  value={form.assigned_to}
                  onChange={e => update('assigned_to', e.target.value)}
                >
                  <option value="">Seleccionar adjuster...</option>
                  {adjusters.map(a => (
                    <option key={a.id} value={a.id}>{a.username} — {a.name}</option>
                  ))}
                </select>
                {errors.assigned_to && <p className="text-xs text-red-500">{errors.assigned_to}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Instrucciones para el adjuster</label>
                <textarea
                  className="input-darey resize-none"
                  rows={3}
                  placeholder="Notas especiales, instrucciones de atención, datos del contacto en aseguradora, prioridades..."
                  value={form.assignment_notes}
                  onChange={e => update('assignment_notes', e.target.value)}
                />
              </div>
            </div>
          </Section>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancelar</button>
          <button type="submit" className="btn-primary px-6" disabled={saving}>
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Registrando...
              </span>
            ) : (
              <><Save className="w-4 h-4" /> Registrar y asignar expediente</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

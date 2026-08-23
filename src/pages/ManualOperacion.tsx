import React, { useState } from 'react';
import {
  BookOpen, Shield, Radio, Camera, FileCheck, CheckCircle2, Lock,
  Users, WifiOff, MapPin, Zap, ChevronRight, ChevronDown, Download,
  Layers, Search, Check, AlertCircle, RefreshCw
} from 'lucide-react';

// ================================================================
// Manual Interactivo de Operación — Centro de Guías y Procesos
// ================================================================

interface SectionProps {
  id: string;
  num: string;
  title: string;
  icon: React.ElementType;
  role: string;
  roleBadge: string;
  children: React.ReactNode;
}

function ManualSection({ id, num, title, icon: Icon, role, roleBadge, children }: SectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div id={id} className="card overflow-hidden scroll-mt-20">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-bg-subtle transition-colors text-left border-b border-gray-100"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-azul-darey/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-azul-darey" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs text-azul-darey tracking-wide">MÓDULO {num}</span>
              <span className={`badge text-[10px] ${roleBadge}`}>{role}</span>
            </div>
            <h2 className="font-bold text-base text-carbon mt-0.5">{title}</h2>
          </div>
        </div>
        <div className="p-1 rounded-lg text-text-muted">
          {open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>

      {open && <div className="p-5 lg:p-6 space-y-4 bg-white text-sm">{children}</div>}
    </div>
  );
}

function StepBox({ num, title, desc, tip }: { num: string; title: string; desc: React.ReactNode; tip?: string }) {
  return (
    <div className="flex items-start gap-3.5 p-3.5 bg-bg-subtle rounded-xl border border-gray-100">
      <div className="w-7 h-7 rounded-lg bg-azul-profundo text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
        {num}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="font-semibold text-carbon text-sm">{title}</h4>
        <div className="text-xs text-text-muted leading-relaxed">{desc}</div>
        {tip && (
          <div className="text-[11px] text-azul-darey bg-white p-2 rounded-lg border border-azul-darey/20 mt-2 font-medium">
            💡 <strong>Tip operativo:</strong> {tip}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ManualOperacion() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<'TODOS' | 'CENTRAL' | 'AJUSTADOR' | 'REVISOR' | 'ADMIN'>('TODOS');

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-azul-profundo via-azul-darey to-cian text-white rounded-2xl p-6 lg:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-200">Documentación Oficial DAREY</span>
            <h1 className="text-2xl font-bold">Manual de Operación & Procedimientos</h1>
          </div>
        </div>
        <p className="text-sm text-white/80 max-w-2xl mt-2 leading-relaxed">
          Guía técnica paso a paso para el despacho central de siniestros, integración de los 17 componentes en campo, mesa de control, validación documental y exportación consolidada.
        </p>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[
            { id: 'TODOS', label: 'Todos los procesos' },
            { id: 'CENTRAL', label: 'Central / Asignador' },
            { id: 'AJUSTADOR', label: 'Ajustador en Campo' },
            { id: 'REVISOR', label: 'Mesa de Control / Revisor' },
            { id: 'ADMIN', label: 'Super Administrador' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedRole(f.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedRole === f.id
                  ? 'bg-white text-azul-profundo shadow-sm'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* MODULO 1: ACCESO Y SEGURIDAD */}
      {(selectedRole === 'TODOS' || selectedRole === 'CENTRAL' || selectedRole === 'AJUSTADOR' || selectedRole === 'REVISOR' || selectedRole === 'ADMIN') && (
        <ManualSection
          id="m1"
          num="01"
          title="Acceso al Sistema y Verificación en 2 Pasos (2FA/MFA)"
          icon={Shield}
          role="Todos los roles"
          roleBadge="bg-blue-100 text-blue-700"
        >
          <p className="text-xs text-text-muted leading-relaxed">
            La plataforma cuenta con doble factor de autenticación obligatorio para proteger la información pericial y cumplir con la política de seguridad corporativa.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <StepBox
              num="1"
              title="Inicio con Usuario y Contraseña"
              desc="Ingresa con tu identificador asignado (ej. CENTRAL-01, AJUSTADOR-01). El sistema valida la protección perimetral anti-bots Cloudflare Turnstile en segundo plano."
            />
            <StepBox
              num="2"
              title="Código Dinámico de 6 Dígitos"
              desc="Abre tu app Authenticator en el teléfono (Google Authenticator, Microsoft Authenticator o Authy) e ingresa el código temporal vigente."
              tip="En el entorno de demostración local puedes ingresar 123456."
            />
          </div>
        </ManualSection>
      )}

      {/* MODULO 2: DESPACHO Y ASIGNACIÓN (CENTRAL) */}
      {(selectedRole === 'TODOS' || selectedRole === 'CENTRAL' || selectedRole === 'ADMIN') && (
        <ManualSection
          id="m2"
          num="02"
          title="Central de Despacho: Registro y Asignación de Siniestros"
          icon={Radio}
          role="Admin Asignador / Central"
          roleBadge="bg-orange-100 text-orange-700"
        >
          <p className="text-xs text-text-muted leading-relaxed">
            El personal de Central recibe la llamada o aviso de la aseguradora, genera el expediente en el sistema con los datos preliminares y despacha al ajustador responsable.
          </p>

          <div className="space-y-3 pt-2">
            <StepBox
              num="1"
              title="Dar de alta el siniestro"
              desc="Haz clic en el botón azul '+ Nuevo reporte / Asignar' en el Dashboard o lista de expedientes."
            />
            <StepBox
              num="2"
              title="Capturar datos del reporte de la aseguradora"
              desc="Ingresa número de siniestro oficial, aseguradora (Afirme, General de Seguros, etc.), fecha/hora y nivel de prioridad (Normal, Urgente o Catástrofe)."
            />
            <StepBox
              num="3"
              title="Fijar ubicación y datos del vehículo asegurado"
              desc="Escribe la dirección exacta o cruces carreteros. Captura placas, color y marca del vehículo asegurado para que el ajustador pueda ubicarlo fácilmente."
              tip="El ajustador recibirá un botón directo para abrir Google Maps / Waze."
            />
            <StepBox
              num="4"
              title="Asignar al Ajustador en turno y guardar"
              desc="Selecciona al ajustador de la lista, redacta instrucciones especiales si las hay y pulsa 'Registrar y asignar expediente'. El estatus pasará a ASIGNADO."
            />
          </div>
        </ManualSection>
      )}

      {/* MODULO 3: OPERACIÓN EN CAMPO (AJUSTADOR) */}
      {(selectedRole === 'TODOS' || selectedRole === 'AJUSTADOR') && (
        <ManualSection
          id="m3"
          num="03"
          title="Operación en Campo e Integración de los 17 Componentes"
          icon={Camera}
          role="Ajustador en Campo"
          roleBadge="bg-green-100 text-green-700"
        >
          <p className="text-xs text-text-muted leading-relaxed">
            Procedimiento oficial para el levantamiento pericial en el lugar del siniestro, respetando los 5 bloques y 17 componentes obligatorios.
          </p>

          <div className="space-y-3 pt-2">
            <StepBox
              num="1"
              title="Recepción de Asignación y Traslado GPS"
              desc="Revisa el banner morado en tu Dashboard. Abre el expediente y toca 'Abrir en Google Maps / GPS' para navegar a la escena del siniestro."
            />
            <StepBox
              num="2"
              title="Iniciar Integración en Sitio"
              desc="Al llegar con el asegurado, pulsa el botón 'Llegué a la escena / Iniciar integración' para activar la captura de evidencias."
            />
            <StepBox
              num="3"
              title="Captura en Orden Oficial (1 al 17)"
              desc={
                <div className="space-y-2 mt-1">
                  <div><strong>Bloque 1:</strong> DUA Lado A y Lado B (declaraciones y firmas).</div>
                  <div><strong>Bloque 2:</strong> Órdenes de taller y pases médicos (o solicitar 'No Aplica' si no hubo).</div>
                  <div><strong>Bloque 3:</strong> Capturas de pantalla de conclusión, encuesta y estimaciones.</div>
                  <div><strong>Bloque 4:</strong> Serie/VIN, licencia, tarjeta de circulación, las 4 esquinas del asegurado (slots fijos) y fotos de daños.</div>
                  <div><strong>Bloque 5:</strong> Evidencias del tercero si existe vehículo involucrado.</div>
                </div>
              }
              tip="El componente 11 (4 Esquinas Asegurado) y 16 (4 Esquinas Tercero) tienen 4 casillas fijas obligatorias: Frontal Izq, Frontal Der, Trasera Izq y Trasera Der."
            />
            <StepBox
              num="4"
              title="Envío a Mesa de Control"
              desc="Verifica que el '% Integración' esté completo y presiona 'Enviar a revisión'."
            />
          </div>
        </ManualSection>
      )}

      {/* MODULO 4: REVISIÓN Y VALIDACIÓN */}
      {(selectedRole === 'TODOS' || selectedRole === 'REVISOR' || selectedRole === 'ADMIN') && (
        <ManualSection
          id="m4"
          num="04"
          title="Mesa de Control: Validación Evidencia por Evidencia"
          icon={FileCheck}
          role="Revisor / Mesa de Control"
          roleBadge="bg-purple-100 text-purple-700"
        >
          <p className="text-xs text-text-muted leading-relaxed">
            Evaluación técnica de calidad, consistencia y legibilidad documental antes de autorizar el cierre definitivo.
          </p>

          <div className="space-y-3 pt-2">
            <StepBox
              num="1"
              title="Consultar la Cola de Revisión"
              desc="Ingresa a 'Cola de revisión' en la barra lateral. Los siniestros están ordenados por antigüedad y prioridad."
            />
            <StepBox
              num="2"
              title="Validar, Observar o Rechazar cada foto"
              desc="Pulsa los tres puntos (···) en cada evidencia: Validar (verde), Observar con comentario correctivo (ámbar), o Rechazar por documento incorrecto o foto ilegible (rojo)."
              tip="Las correcciones nunca borran la foto anterior; se crea una nueva versión v2 manteniendo el historial intacto."
            />
            <StepBox
              num="3"
              title="Aprobación de 'No Aplica'"
              desc="Revisa y autoriza las solicitudes de No Aplica emitidas por el ajustador (ej. Sin lesionados / Sin tercero)."
            />
          </div>
        </ManualSection>
      )}

      {/* MODULO 5: CIERRE Y EXPORTACIÓN */}
      {(selectedRole === 'TODOS' || selectedRole === 'REVISOR' || selectedRole === 'ADMIN') && (
        <ManualSection
          id="m5"
          num="05"
          title="Cierre, Bloqueo y Descarga de Expediente Integrado"
          icon={Download}
          role="Revisores Senior / Coordinadores"
          roleBadge="bg-emerald-100 text-emerald-800"
        >
          <div className="space-y-3">
            <StepBox
              num="1"
              title="Confirmación de 100% de Validación"
              desc="El sistema verifica que todos los requisitos aplicables estén validados. Se desbloquea el botón verde 'Cerrar expediente'."
            />
            <StepBox
              num="2"
              title="Cierre y Bloqueo Inmutable"
              desc="Al cerrar, el expediente queda protegido contra alteraciones accidentales y se registra la fecha y usuario de cierre en la bitácora."
            />
            <StepBox
              num="3"
              title="Generación de PDF con Portada y Marca de Agua"
              desc="Descarga el PDF consolidado con portada de alta legibilidad, índice matriz 1-17 y marca de agua transparente al 25% sobre las fotos periciales."
            />
          </div>
        </ManualSection>
      )}

      {/* MODULO 6: ADMINISTRACIÓN */}
      {(selectedRole === 'TODOS' || selectedRole === 'ADMIN') && (
        <ManualSection
          id="m6"
          num="06"
          title="Administración de Usuarios y Bitácora de Auditoría"
          icon={Users}
          role="Super Administrador"
          roleBadge="bg-purple-100 text-purple-700"
        >
          <div className="space-y-3">
            <StepBox
              num="1"
              title="Gestión de Cuentas y Roles"
              desc="Creación de ajustadores, revisores y personal de central. Activación y desactivación inmediata de accesos."
            />
            <StepBox
              num="2"
              title="Bitácora de Auditoría en Tiempo Real"
              desc="Registro inalterable de cada inicio de sesión, asignación de siniestro, carga de archivo, validación y exportación."
            />
          </div>
        </ManualSection>
      )}
    </div>
  );
}

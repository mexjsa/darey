// ================================================================
// NEXOS Integrador Documental — Tipos Globales Multi-Inquilino
// Refleja el modelo de datos SaaS B2B y PRD de Ciberseguridad L3
// ================================================================

export type TenantStatus = 'ACTIVO' | 'SUSPENDIDO' | 'PRUEBA';

export interface Tenant {
  id: string;
  slug: string;                  // 'darey', 'centro', 'norte'
  name: string;                  // 'DAREY Ajustadores Profesionales S.C.'
  short_name: string;            // 'DAREY'
  rfc?: string;
  logo_url: string;              // Base64 o URL del logotipo
  primary_color: string;         // Hex code '#0089A9'
  secondary_color: string;       // Hex code '#005A82'
  accent_color: string;          // Hex code '#F8C400'
  watermark_text: string;        // 'DAREY AJUSTADORES'
  watermark_opacity: number;     // 0.25 (25%)
  plan_seats_limit: number;      // Límite de usuarios/asientos contratados (ej. 10)
  price_per_user_mxn: number;    // Costo unitario por usuario al mes ($490 MXN)
  billing_cycle: 'MENSUAL' | 'ANUAL';
  storage_retention_days: number;// 365 días por defecto
  status: TenantStatus;
  created_at: string;
}

export type UserRole =
  | 'NEXOS_SUPER_ADMIN' // Operador Master SaaS NEXOS
  | 'SUPER_ADMIN'       // Admin General del Despacho Inquilino
  | 'ADMIN_ASIGNADOR'   // Central del Despacho — crea expedientes y asigna adjuster
  | 'ADMINISTRADOR'
  | 'COORDINADOR'
  | 'REVISOR_SENIOR'
  | 'REVISOR'
  | 'AJUSTADOR';

export interface User {
  id: string;
  tenant_id: string;    // Inquilino al que pertenece el usuario
  username: string;
  name: string;
  role: UserRole;
  mfa_enabled: boolean;
  mfa_enrolled: boolean;
  active: boolean;
  created_at: string;
  avatar?: string;
}

// ----------------------------------------------------------------
// ESTADOS
// ----------------------------------------------------------------

export type ExpedienteStatus =
  | 'BORRADOR'
  | 'ASIGNADO'             // ← NUEVO: creado por central, pendiente que adjuster inicie
  | 'EN_INTEGRACION'
  | 'LISTO_PARA_REVISION'
  | 'EN_REVISION'
  | 'CON_OBSERVACIONES'
  | 'EN_CORRECCION'
  | 'REENVIADO'
  | 'VALIDADO'
  | 'CERRADO'
  | 'BLOQUEADO'
  | 'REABIERTO';

export type EvidenciaStatus =
  | 'PENDIENTE'
  | 'CARGADA'
  | 'EN_REVISION'
  | 'OBSERVADA'
  | 'RECHAZADA'
  | 'VALIDADA'
  | 'NO_APLICA'
  | 'SUSTITUIDA';

export type SourceMode = 'ONLINE' | 'OFFLINE' | 'IMPORTADO';

// ----------------------------------------------------------------
// CATÁLOGO DE HALLAZGOS
// ----------------------------------------------------------------

export type HallazgoCode =
  | 'DOCUMENTO_FALTANTE'
  | 'DOCUMENTO_INCORRECTO'
  | 'DOCUMENTO_ILEGIBLE'
  | 'DOCUMENTO_INCOMPLETO'
  | 'FOTO_DESENFOCADA'
  | 'FOTO_OBSTRUIDA'
  | 'FOTO_ANGULO_INCORRECTO'
  | 'FOTO_DUPLICADA'
  | 'FALTA_ESQUINA_FRONTAL_IZQUIERDA'
  | 'FALTA_ESQUINA_FRONTAL_DERECHA'
  | 'FALTA_ESQUINA_TRASERA_IZQUIERDA'
  | 'FALTA_ESQUINA_TRASERA_DERECHA'
  | 'FALTA_FIRMA'
  | 'VIN_NO_LEGIBLE'
  | 'VIN_NO_COINCIDE'
  | 'PLACAS_NO_COINCIDEN'
  | 'NOMBRE_NO_COINCIDE'
  | 'LICENCIA_VENCIDA'
  | 'TARJETA_NO_COINCIDE'
  | 'SINIESTRO_NO_COINCIDE'
  | 'CONCLUSION_NO_COINCIDE'
  | 'ESTIMACION_NO_COINCIDE'
  | 'DAÑO_NO_CORRESPONDE'
  | 'EVIDENCIA_INSUFICIENTE'
  | 'OTRO';

// ----------------------------------------------------------------
// SLOT DE 4 ESQUINAS
// ----------------------------------------------------------------

export type SlotEsquina =
  | 'FRONTAL_IZQ'
  | 'FRONTAL_DER'
  | 'TRASERA_IZQ'
  | 'TRASERA_DER';

// ----------------------------------------------------------------
// CATÁLOGO DE 17 COMPONENTES
// ----------------------------------------------------------------

export interface ComponenteCatalogo {
  id: number; // 1–17
  nombre: string;
  bloque: number; // 1–5
  tipo: 'DOCUMENTO' | 'FOTO' | 'CAPTURA';
  min_evidencias: number;
  max_evidencias: number | null; // null = ilimitado
  puede_no_aplica: boolean;
  slots?: SlotEsquina[]; // solo componentes 11 y 16
  obligatorio: boolean;
  descripcion: string;
}

export const CATALOGO_COMPONENTES: ComponenteCatalogo[] = [
  // BLOQUE 1 — DECLARACIÓN DEL SINIESTRO
  { id: 1, nombre: 'DUA Lado A', bloque: 1, tipo: 'DOCUMENTO', min_evidencias: 1, max_evidencias: 1, puede_no_aplica: false, obligatorio: true, descripcion: 'Declaración Única de Accidente — cara A' },
  { id: 2, nombre: 'DUA Lado B', bloque: 1, tipo: 'DOCUMENTO', min_evidencias: 1, max_evidencias: 1, puede_no_aplica: false, obligatorio: true, descripcion: 'Declaración Única de Accidente — cara B' },
  // BLOQUE 2 — SERVICIOS DERIVADOS
  { id: 3, nombre: 'Orden(es) de Taller', bloque: 2, tipo: 'DOCUMENTO', min_evidencias: 0, max_evidencias: null, puede_no_aplica: true, obligatorio: false, descripcion: 'Cada orden de taller como evidencia independiente' },
  { id: 4, nombre: 'Pase(s) Médico(s)', bloque: 2, tipo: 'DOCUMENTO', min_evidencias: 0, max_evidencias: null, puede_no_aplica: true, obligatorio: false, descripcion: 'Cada pase médico como evidencia independiente' },
  // BLOQUE 3 — CIERRE Y REGISTROS DE SISTEMA
  { id: 5, nombre: 'Captura Conclusión', bloque: 3, tipo: 'CAPTURA', min_evidencias: 1, max_evidencias: null, puede_no_aplica: false, obligatorio: true, descripcion: 'Captura de pantalla de conclusión del sistema' },
  { id: 6, nombre: 'Captura Encuesta de Servicio', bloque: 3, tipo: 'CAPTURA', min_evidencias: 1, max_evidencias: null, puede_no_aplica: false, obligatorio: true, descripcion: 'Captura de pantalla de encuesta de servicio' },
  { id: 7, nombre: 'Captura Estimaciones', bloque: 3, tipo: 'CAPTURA', min_evidencias: 1, max_evidencias: null, puede_no_aplica: false, obligatorio: true, descripcion: 'Captura de pantalla de estimaciones' },
  // BLOQUE 4 — EVIDENCIA DEL ASEGURADO
  { id: 8, nombre: 'Foto Serie — Asegurado', bloque: 4, tipo: 'FOTO', min_evidencias: 1, max_evidencias: null, puede_no_aplica: false, obligatorio: true, descripcion: 'Fotografía del número de serie del vehículo asegurado' },
  { id: 9, nombre: 'Foto Licencia — Asegurado', bloque: 4, tipo: 'FOTO', min_evidencias: 1, max_evidencias: null, puede_no_aplica: false, obligatorio: true, descripcion: 'Fotografía de la licencia del asegurado' },
  { id: 10, nombre: 'Foto Tarjeta de Circulación — Asegurado', bloque: 4, tipo: 'FOTO', min_evidencias: 1, max_evidencias: null, puede_no_aplica: false, obligatorio: true, descripcion: 'Fotografía de la tarjeta de circulación del asegurado' },
  { id: 11, nombre: 'Fotos 4 Esquinas — Asegurado', bloque: 4, tipo: 'FOTO', min_evidencias: 4, max_evidencias: 4, puede_no_aplica: false, obligatorio: true, slots: ['FRONTAL_IZQ', 'FRONTAL_DER', 'TRASERA_IZQ', 'TRASERA_DER'], descripcion: '4 fotografías desde cada ángulo del vehículo asegurado' },
  { id: 12, nombre: 'Fotos de Daños — Asegurado', bloque: 4, tipo: 'FOTO', min_evidencias: 1, max_evidencias: null, puede_no_aplica: false, obligatorio: true, descripcion: 'Fotografías de los daños del vehículo asegurado' },
  // BLOQUE 5 — EVIDENCIA DEL TERCERO
  { id: 13, nombre: 'Foto Serie — Tercero', bloque: 5, tipo: 'FOTO', min_evidencias: 1, max_evidencias: null, puede_no_aplica: true, obligatorio: false, descripcion: 'Fotografía del número de serie del vehículo del tercero' },
  { id: 14, nombre: 'Foto Licencia — Tercero', bloque: 5, tipo: 'FOTO', min_evidencias: 1, max_evidencias: null, puede_no_aplica: true, obligatorio: false, descripcion: 'Fotografía de la licencia del tercero' },
  { id: 15, nombre: 'Foto Tarjeta de Circulación — Tercero', bloque: 5, tipo: 'FOTO', min_evidencias: 1, max_evidencias: null, puede_no_aplica: true, obligatorio: false, descripcion: 'Fotografía de la tarjeta de circulación del tercero' },
  { id: 16, nombre: 'Fotos 4 Esquinas — Tercero', bloque: 5, tipo: 'FOTO', min_evidencias: 4, max_evidencias: 4, puede_no_aplica: true, obligatorio: false, slots: ['FRONTAL_IZQ', 'FRONTAL_DER', 'TRASERA_IZQ', 'TRASERA_DER'], descripcion: '4 fotografías desde cada ángulo del vehículo del tercero' },
  { id: 17, nombre: 'Fotos de Daños — Tercero', bloque: 5, tipo: 'FOTO', min_evidencias: 1, max_evidencias: null, puede_no_aplica: true, obligatorio: false, descripcion: 'Fotografías de los daños del vehículo del tercero' },
];

export const BLOQUES = [
  { id: 1, nombre: 'Declaración del Siniestro', componentes: [1, 2] },
  { id: 2, nombre: 'Servicios Derivados', componentes: [3, 4] },
  { id: 3, nombre: 'Cierre y Registros de Sistema', componentes: [5, 6, 7] },
  { id: 4, nombre: 'Evidencia del Asegurado', componentes: [8, 9, 10, 11, 12] },
  { id: 5, nombre: 'Evidencia del Tercero', componentes: [13, 14, 15, 16, 17] },
];

// ----------------------------------------------------------------
// MODELO EXPEDIENTE
// ----------------------------------------------------------------

export interface DatosPersona {
  nombre: string;
  telefono?: string;
  correo?: string;
}

export interface DatosVehiculo {
  placas: string;
  vin?: string;
  marca?: string;
  modelo?: string;
  año?: string;
  color?: string;
}

/** Datos del reporte que llega de la agencia de seguros */
export interface ReporteAseguradora {
  numero_reporte: string;        // folio interno de la aseguradora
  fecha_reporte: string;         // cuándo reportó la aseguradora
  hora_siniestro?: string;       // hora del siniestro si se conoce
  ubicacion_siniestro: string;   // dirección / descripción del lugar
  coordenadas?: { lat: number; lng: number }; // GPS si lo envían
  descripcion_inicial?: string;  // descripción del siniestro según aseguradora
  contacto_aseguradora?: string; // nombre del ejecutivo de la aseguradora
  prioridad: 'NORMAL' | 'URGENTE' | 'CATASTROFE';
}

export interface Hallazgo {
  id: string;
  code: HallazgoCode;
  descripcion: string;
  creado_por: string;
  created_at: string;
}

export interface Validacion {
  id: string;
  dimension: 'EXISTENCIA' | 'TIPO' | 'LEGIBILIDAD' | 'INTEGRIDAD' | 'CALIDAD' | 'CONSISTENCIA' | 'VIGENCIA';
  resultado: 'OK' | 'OBSERVACION' | 'RECHAZO';
  comentario?: string;
  validado_por: string;
  created_at: string;
}

export interface EvidenciaVersion {
  version: number;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  sha256_hash?: string;        // Hash criptográfico SHA-256 para cadena de custodia (SEC-009)
  captured_at: string;
  uploaded_at: string;
  uploaded_by: string;
  status: EvidenciaStatus;
  validaciones: Validacion[];
  hallazgos: Hallazgo[];
  observacion?: string;
  revisado_por?: string;
}

export interface Evidencia {
  id: string;
  slot?: SlotEsquina;
  current_version: number;
  status: EvidenciaStatus;
  versions: EvidenciaVersion[];
}

export interface NoAplica {
  causa: string;
  comentario?: string;
  solicitado_por: string;
  solicitado_at: string;
  aprobado_por?: string;
  aprobado_at?: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
}

export interface ComponenteInstance {
  component_id: number;
  evidencias: Evidencia[];
  no_aplica?: NoAplica;
}

export interface Expediente {
  id: string;
  tenant_id: string;           // Despacho Inquilino propietario del expediente (SEC-005)
  numero_siniestro: string;
  fecha_siniestro: string;
  hora_siniestro?: string;
  fecha_apertura: string;
  aseguradora: string;
  poliza: string;
  folio_dua: string;

  // ---- REPORTE DE ASEGURADORA (datos que llegan con el aviso) ----
  reporte?: ReporteAseguradora;

  // ---- ASEGURADO ----
  asegurado: DatosPersona;
  vehiculo_asegurado: DatosVehiculo;

  // ---- TERCERO ----
  tiene_tercero: boolean;
  tercero?: DatosPersona;
  vehiculo_tercero?: DatosVehiculo;

  // ---- ASIGNACIÓN (flujo central → adjuster) ----
  created_by: string;          // Admin Asignador que creó el expediente
  assigned_to?: string;        // Adjuster asignado para atender el siniestro
  assigned_at?: string;        // Cuándo fue asignado
  assigned_by?: string;        // Quién hizo la asignación (puede ser el mismo que created_by)
  assignment_notes?: string;   // Instrucciones o notas de la central al adjuster

  // ---- REVISIÓN ----
  reviewer_id?: string;

  // ---- ESTADO & ALMACENAMIENTO (SEC-008, SEC-013) ----
  status: ExpedienteStatus;
  archival_tier?: 'HOT' | 'WARM' | 'COLD'; // Nivel de almacenamiento jerárquico
  sha256_manifest?: string;    // Hash SHA-256 consolidado del expediente sellado
  integration_percent: number;
  validation_percent: number;
  source_mode: SourceMode;
  submitted_at?: string;
  validated_at?: string;
  closed_at?: string;
  locked_at?: string;
  componentes: ComponenteInstance[];
  observaciones_abiertas: number;
}

// ----------------------------------------------------------------
// AUDITORÍA (SEC-014)
// ----------------------------------------------------------------

export interface AuditEntry {
  id: string;
  tenant_id: string;           // Inquilino auditado
  user_id: string;
  username: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  prev_value?: string;
  new_value?: string;
  ip_address?: string;
  created_at: string;
}

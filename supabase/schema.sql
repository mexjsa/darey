-- ======================================================================
-- DAREY AJUSTADORES PROFESIONALES S.C.
-- ESQUEMA DE BASE DE DATOS SUPABASE / POSTGRESQL (PRD §27 & Despacho Central)
-- Versión: Definitiva 1.0
-- ======================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------
-- 1. ENUMS Y TIPOS DE DOMINIO
-- ----------------------------------------------------------------------

CREATE TYPE user_role_enum AS ENUM (
  'SUPER_ADMIN',
  'ADMIN_ASIGNADOR',
  'ADMINISTRADOR',
  'COORDINADOR',
  'REVISOR_SENIOR',
  'REVISOR',
  'AJUSTADOR'
);

CREATE TYPE expediente_status_enum AS ENUM (
  'BORRADOR',
  'ASIGNADO',
  'EN_INTEGRACION',
  'LISTO_PARA_REVISION',
  'EN_REVISION',
  'CON_OBSERVACIONES',
  'EN_CORRECCION',
  'REENVIADO',
  'VALIDADO',
  'CERRADO',
  'BLOQUEADO',
  'REABIERTO'
);

CREATE TYPE evidencia_status_enum AS ENUM (
  'PENDIENTE',
  'CARGADA',
  'EN_REVISION',
  'OBSERVADA',
  'RECHAZADA',
  'VALIDADA',
  'NO_APLICA',
  'SUSTITUIDA'
);

CREATE TYPE slot_esquina_enum AS ENUM (
  'FRONTAL_IZQ',
  'FRONTAL_DER',
  'TRASERA_IZQ',
  'TRASERA_DER'
);

CREATE TYPE prioridad_reporte_enum AS ENUM (
  'NORMAL',
  'URGENTE',
  'CATASTROFE'
);

CREATE TYPE source_mode_enum AS ENUM (
  'ONLINE',
  'OFFLINE',
  'IMPORTADO'
);

-- ----------------------------------------------------------------------
-- 2. USUARIOS Y CONTROL DE ACCESO (MFA / TOTP)
-- ----------------------------------------------------------------------

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  name VARCHAR(150) NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'AJUSTADOR',
  password_hash TEXT NOT NULL,
  mfa_enabled BOOLEAN NOT NULL DEFAULT true,
  mfa_enrolled BOOLEAN NOT NULL DEFAULT false,
  mfa_secret_encrypted TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recovery_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 3. EXPEDIENTES (Núcleo + Despacho Central)
-- ----------------------------------------------------------------------

CREATE TABLE expedientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_siniestro VARCHAR(50) UNIQUE NOT NULL,
  fecha_siniestro DATE NOT NULL,
  hora_siniestro TIME,
  fecha_apertura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  aseguradora VARCHAR(100) NOT NULL,
  poliza VARCHAR(100),
  folio_dua VARCHAR(100),

  -- Reporte de la Agencia de Seguros
  numero_reporte_aseguradora VARCHAR(100),
  fecha_reporte_aseguradora TIMESTAMPTZ,
  ubicacion_siniestro TEXT NOT NULL,
  descripcion_inicial TEXT,
  contacto_aseguradora VARCHAR(150),
  prioridad prioridad_reporte_enum NOT NULL DEFAULT 'NORMAL',

  -- Datos del Asegurado
  asegurado_nombre VARCHAR(200) NOT NULL,
  asegurado_telefono VARCHAR(50),
  asegurado_correo VARCHAR(150),

  -- Vehículo Asegurado (Reporte Inicial + Validación Campo)
  va_placas VARCHAR(30) NOT NULL,
  va_vin VARCHAR(50),
  va_marca VARCHAR(50),
  va_modelo VARCHAR(50),
  va_año VARCHAR(10),
  va_color VARCHAR(30),

  -- Tercero involucrado
  tiene_tercero BOOLEAN NOT NULL DEFAULT false,
  tercero_nombre VARCHAR(200),
  tercero_telefono VARCHAR(50),
  vt_placas VARCHAR(30),
  vt_marca VARCHAR(50),
  vt_modelo VARCHAR(50),
  vt_año VARCHAR(10),
  vt_color VARCHAR(30),

  -- Despacho y Asignación (Central → Ajustador)
  created_by UUID NOT NULL REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ,
  assignment_notes TEXT,

  -- Revisión y Validación
  reviewer_id UUID REFERENCES users(id),

  -- Estado y Métricas de Integración / Validación
  status expediente_status_enum NOT NULL DEFAULT 'ASIGNADO',
  integration_percent INTEGER NOT NULL DEFAULT 0,
  validation_percent INTEGER NOT NULL DEFAULT 0,
  observaciones_abiertas INTEGER NOT NULL DEFAULT 0,
  source_mode source_mode_enum NOT NULL DEFAULT 'ONLINE',

  -- Tiempos del ciclo de vida
  submitted_at TIMESTAMPTZ,
  validated_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 4. CATÁLOGO DE LOS 17 COMPONENTES OFICIALES
-- ----------------------------------------------------------------------

CREATE TABLE component_catalog (
  id INT PRIMARY KEY, -- 1 a 17
  nombre VARCHAR(100) NOT NULL,
  bloque INT NOT NULL CHECK (bloque BETWEEN 1 AND 5),
  bloque_nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- 'DOCUMENTO', 'FOTO', 'CAPTURA'
  min_evidencias INT NOT NULL DEFAULT 1,
  max_evidencias INT, -- NULL = ilimitado
  puede_no_aplica BOOLEAN NOT NULL DEFAULT false,
  tiene_slots BOOLEAN NOT NULL DEFAULT false,
  obligatorio BOOLEAN NOT NULL DEFAULT true,
  descripcion TEXT
);

-- Seed de los 17 Componentes Oficiales DAREY
INSERT INTO component_catalog (id, nombre, bloque, bloque_nombre, tipo, min_evidencias, max_evidencias, puede_no_aplica, tiene_slots, obligatorio, descripcion) VALUES
(1,  'DUA Lado A',                              1, 'Declaración del Siniestro',     'DOCUMENTO', 1, 1,    false, false, true,  'Declaración Única de Accidente — cara A'),
(2,  'DUA Lado B',                              1, 'Declaración del Siniestro',     'DOCUMENTO', 1, 1,    false, false, true,  'Declaración Única de Accidente — cara B'),
(3,  'Orden(es) de Taller',                     2, 'Servicios Derivados',           'DOCUMENTO', 0, NULL, true,  false, false, 'Cada orden de taller como evidencia independiente'),
(4,  'Pase(s) Médico(s)',                       2, 'Servicios Derivados',           'DOCUMENTO', 0, NULL, true,  false, false, 'Cada pase médico como evidencia independiente'),
(5,  'Captura Conclusión',                      3, 'Cierre y Registros de Sistema', 'CAPTURA',   1, NULL, false, false, true,  'Captura de pantalla de conclusión del sistema'),
(6,  'Captura Encuesta de Servicio',            3, 'Cierre y Registros de Sistema', 'CAPTURA',   1, NULL, false, false, true,  'Captura de pantalla de encuesta de servicio'),
(7,  'Captura Estimaciones',                    3, 'Cierre y Registros de Sistema', 'CAPTURA',   1, NULL, false, false, true,  'Captura de pantalla de estimaciones'),
(8,  'Foto Serie — Asegurado',                  4, 'Evidencia del Asegurado',       'FOTO',      1, NULL, false, false, true,  'Fotografía del número de serie del vehículo asegurado'),
(9,  'Foto Licencia — Asegurado',               4, 'Evidencia del Asegurado',       'FOTO',      1, NULL, false, false, true,  'Fotografía de la licencia del asegurado'),
(10, 'Foto Tarjeta de Circulación — Asegurado', 4, 'Evidencia del Asegurado',       'FOTO',      1, NULL, false, false, true,  'Fotografía de la tarjeta de circulación del asegurado'),
(11, 'Fotos 4 Esquinas — Asegurado',            4, 'Evidencia del Asegurado',       'FOTO',      4, 4,    false, true,  true,  '4 fotografías fijas desde cada esquina del vehículo asegurado'),
(12, 'Fotos de Daños — Asegurado',              4, 'Evidencia del Asegurado',       'FOTO',      1, NULL, false, false, true,  'Fotografías detalladas de los daños del vehículo asegurado'),
(13, 'Foto Serie — Tercero',                    5, 'Evidencia del Tercero',         'FOTO',      1, NULL, true,  false, false, 'Fotografía del número de serie del vehículo del tercero'),
(14, 'Foto Licencia — Tercero',                 5, 'Evidencia del Tercero',         'FOTO',      1, NULL, true,  false, false, 'Fotografía de la licencia del tercero'),
(15, 'Foto Tarjeta de Circulación — Tercero',   5, 'Evidencia del Tercero',         'FOTO',      1, NULL, true,  false, false, 'Fotografía de la tarjeta de circulación del tercero'),
(16, 'Fotos 4 Esquinas — Tercero',              5, 'Evidencia del Tercero',         'FOTO',      4, 4,    true,  true,  false, '4 fotografías fijas desde cada esquina del vehículo del tercero'),
(17, 'Fotos de Daños — Tercero',                5, 'Evidencia del Tercero',         'FOTO',      1, NULL, true,  false, false, 'Fotografías de los daños del vehículo del tercero')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------
-- 5. INSTANCIAS DE COMPONENTES POR EXPEDIENTE
-- ----------------------------------------------------------------------

CREATE TABLE component_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expediente_id UUID NOT NULL REFERENCES expedientes(id) ON DELETE CASCADE,
  component_id INT NOT NULL REFERENCES component_catalog(id),
  
  -- Gestión de 'No Aplica'
  no_aplica_causa TEXT,
  no_aplica_comentario TEXT,
  no_aplica_solicitado_por UUID REFERENCES users(id),
  no_aplica_solicitado_at TIMESTAMPTZ,
  no_aplica_aprobado_por UUID REFERENCES users(id),
  no_aplica_aprobado_at TIMESTAMPTZ,
  no_aplica_estado VARCHAR(20) DEFAULT 'NONE', -- 'NONE', 'PENDIENTE', 'APROBADO', 'RECHAZADO'

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(expediente_id, component_id)
);

-- ----------------------------------------------------------------------
-- 6. EVIDENCIAS Y VERSIONAMIENTO INMUTABLE
-- ----------------------------------------------------------------------

CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  component_instance_id UUID NOT NULL REFERENCES component_instances(id) ON DELETE CASCADE,
  slot slot_esquina_enum, -- Solo para comp 11 y 16
  current_version INT NOT NULL DEFAULT 1,
  status evidencia_status_enum NOT NULL DEFAULT 'PENDIENTE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE evidence_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
  version INT NOT NULL,
  storage_path TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  status evidencia_status_enum NOT NULL DEFAULT 'CARGADA',
  revisado_por UUID REFERENCES users(id),
  observacion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(evidence_id, version)
);

-- ----------------------------------------------------------------------
-- 7. AUDITORÍA COMPLETA
-- ----------------------------------------------------------------------

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  username VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100),
  details TEXT,
  prev_value TEXT,
  new_value TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 8. POLÍTICAS RLS (Row Level Security)
-- ----------------------------------------------------------------------

ALTER TABLE expedientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Lectura de expedientes: Ajustadores ven los asignados a ellos; Administradores y Revisores ven todos
CREATE POLICY "Ajustadores ven asignados, Central/Revisores ven todos" ON expedientes
  FOR SELECT USING (
    auth.uid() = assigned_to OR 
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() 
      AND users.role IN ('SUPER_ADMIN', 'ADMIN_ASIGNADOR', 'ADMINISTRADOR', 'COORDINADOR', 'REVISOR_SENIOR', 'REVISOR')
    )
  );

-- Creación de expedientes: Solo Central y Administradores
CREATE POLICY "Central crea expedientes" ON expedientes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() 
      AND users.role IN ('SUPER_ADMIN', 'ADMIN_ASIGNADOR', 'ADMINISTRADOR', 'COORDINADOR')
    )
  );

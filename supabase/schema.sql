-- ======================================================================
-- NEXOS IA — PLATAFORMA SAAS MULTI-INQUILINO (INTEGRADOR DOCUMENTAL)
-- ESQUEMA DE BASE DE DATOS SUPABASE / POSTGRESQL (PRD L3 & MULTI-TENANCY)
-- Versión: 2.0 Multi-Tenant B2B (Per-Seat Licensing & Tiered Storage)
-- ======================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------

CREATE TYPE tenant_status_enum AS ENUM ('ACTIVO', 'SUSPENDIDO', 'PRUEBA');

CREATE TYPE user_role_enum AS ENUM (
  'NEXOS_SUPER_ADMIN', -- Operador Maestro SaaS NEXOS
  'SUPER_ADMIN',       -- Administrador General del Despacho
  'ADMIN_ASIGNADOR',   -- Central de Despacho
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

CREATE TYPE storage_tier_enum AS ENUM ('HOT', 'WARM', 'COLD');

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

-- ----------------------------------------------------------------------
-- 2. TABLA MAESTRA: TENANTS (DESPACHOS INQUILINOS)
-- ----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  rfc TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#0089A9',
  secondary_color TEXT DEFAULT '#005A82',
  accent_color TEXT DEFAULT '#F8C400',
  watermark_text TEXT NOT NULL,
  watermark_opacity NUMERIC(3,2) DEFAULT 0.25,
  plan_seats_limit INT NOT NULL DEFAULT 5,
  price_per_user_mxn NUMERIC(10,2) NOT NULL DEFAULT 490.00,
  billing_cycle TEXT DEFAULT 'MENSUAL',
  storage_retention_days INT DEFAULT 365,
  status tenant_status_enum DEFAULT 'ACTIVO',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 3. USUARIOS PARTICIONADOS POR INQUILINO (PER-SEAT BILLING)
-- ----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  auth_user_id UUID UNIQUE,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  role user_role_enum NOT NULL DEFAULT 'AJUSTADOR',
  mfa_enabled BOOLEAN DEFAULT true,
  mfa_enrolled BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, username)
);

-- ----------------------------------------------------------------------
-- 4. EXPEDIENTES (TENANT ISOLATED & TIERED STORAGE)
-- ----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.expedientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  numero_siniestro TEXT NOT NULL,
  fecha_siniestro DATE NOT NULL,
  hora_siniestro TIME,
  fecha_apertura TIMESTAMPTZ DEFAULT NOW(),
  aseguradora TEXT NOT NULL,
  poliza TEXT NOT NULL,
  folio_dua TEXT,
  reporte JSONB,
  asegurado JSONB NOT NULL,
  vehiculo_asegurado JSONB NOT NULL,
  tiene_tercero BOOLEAN DEFAULT false,
  tercero JSONB,
  vehiculo_tercero JSONB,
  created_by UUID NOT NULL REFERENCES public.users(id),
  assigned_to UUID REFERENCES public.users(id),
  assigned_at TIMESTAMPTZ,
  assigned_by UUID REFERENCES public.users(id),
  assignment_notes TEXT,
  reviewer_id UUID REFERENCES public.users(id),
  status expediente_status_enum NOT NULL DEFAULT 'ASIGNADO',
  archival_tier storage_tier_enum DEFAULT 'HOT',
  sha256_manifest TEXT,
  integration_percent INT DEFAULT 0,
  validation_percent INT DEFAULT 0,
  source_mode TEXT DEFAULT 'ONLINE',
  submitted_at TIMESTAMPTZ,
  validated_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, numero_siniestro)
);

-- ----------------------------------------------------------------------
-- 5. EVIDENCIAS CON SHA-256 (SEC-008, SEC-009)
-- ----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.evidencia_versiones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expediente_id UUID NOT NULL REFERENCES public.expedientes(id) ON DELETE CASCADE,
  component_id INT NOT NULL,
  slot TEXT,
  version INT NOT NULL DEFAULT 1,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INT NOT NULL,
  sha256_hash TEXT NOT NULL, -- Checksum legal
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID NOT NULL REFERENCES public.users(id),
  status evidencia_status_enum NOT NULL DEFAULT 'CARGADA',
  observacion TEXT,
  revisado_por UUID REFERENCES public.users(id)
);

-- ----------------------------------------------------------------------
-- 6. BITÁCORA DE AUDITORÍA LEGAL (SEC-014)
-- ----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  prev_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 7. POLÍTICAS ROW LEVEL SECURITY (RLS - SEC-005, SEC-010)
-- ----------------------------------------------------------------------

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expedientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidencia_versiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Política de lectura de expedientes por tenant
CREATE POLICY "tenant_isolation_expedientes"
ON public.expedientes
FOR ALL
USING (
  tenant_id = (auth.jwt() ->> 'tenant_id')::UUID
  OR (auth.jwt() ->> 'role') = 'NEXOS_SUPER_ADMIN'
);

-- Política de lectura de usuarios por tenant
CREATE POLICY "tenant_isolation_users"
ON public.users
FOR ALL
USING (
  tenant_id = (auth.jwt() ->> 'tenant_id')::UUID
  OR (auth.jwt() ->> 'role') = 'NEXOS_SUPER_ADMIN'
);

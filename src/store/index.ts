// ================================================================
// NEXOS Integrador Documental — Store Global Multi-Inquilino (Zustand)
// SaaS B2B: Facturacion por Asientos (Per-Seat) y Seguridad L3
// ================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Tenant, User, Expediente, AuditEntry, ComponenteInstance,
  EvidenciaStatus, ExpedienteStatus, ReporteAseguradora, Validacion
} from '@/types';
import { CATALOGO_COMPONENTES } from '@/types';
import { DAREY_ICON_CIRCLE } from '@/assets/logo';
import { calculateSHA256 } from '@/utils/crypto';

// ----------------------------------------------------------------
// INQUILINOS INICIALES (TENANTS)
// ----------------------------------------------------------------

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-darey',
    slug: 'darey',
    name: 'DAREY Ajustadores Profesionales S.C.',
    short_name: 'DAREY',
    rfc: 'DAP180315ABC',
    logo_url: DAREY_ICON_CIRCLE,
    primary_color: '#0089A9',
    secondary_color: '#005A82',
    accent_color: '#F8C400',
    watermark_text: 'DAREY AJUSTADORES S.C.',
    watermark_opacity: 0.25,
    plan_seats_limit: 10,
    price_per_user_mxn: 490,
    billing_cycle: 'MENSUAL',
    storage_retention_days: 365,
    status: 'ACTIVO',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'tenant-centro',
    slug: 'centro',
    name: 'Ajustadores Periciales del Centro S.A.',
    short_name: 'CENTRO',
    rfc: 'APC200412XYZ',
    logo_url: DAREY_ICON_CIRCLE,
    primary_color: '#2E7D32',
    secondary_color: '#1B5E20',
    accent_color: '#FFB300',
    watermark_text: 'AJUSTADORES DEL CENTRO S.A.',
    watermark_opacity: 0.25,
    plan_seats_limit: 5,
    price_per_user_mxn: 490,
    billing_cycle: 'MENSUAL',
    storage_retention_days: 365,
    status: 'ACTIVO',
    created_at: '2026-02-15T00:00:00Z'
  },
  {
    id: 'tenant-norte',
    slug: 'norte',
    name: 'Peritajes y Ajustes del Norte S.C.',
    short_name: 'NORTE',
    rfc: 'PAN220719KLM',
    logo_url: DAREY_ICON_CIRCLE,
    primary_color: '#D32F2F',
    secondary_color: '#B71C1C',
    accent_color: '#FF9800',
    watermark_text: 'PERITAJES DEL NORTE S.C.',
    watermark_opacity: 0.25,
    plan_seats_limit: 8,
    price_per_user_mxn: 490,
    billing_cycle: 'MENSUAL',
    storage_retention_days: 180,
    status: 'PRUEBA',
    created_at: '2026-08-01T00:00:00Z'
  }
];

// ----------------------------------------------------------------
// USUARIOS DEMO (POR INQUILINO)
// ----------------------------------------------------------------

const USERS_DEMO: User[] = [
  // Master SaaS Operator (NEXOS IA)
  { id: 'u-nexos', tenant_id: 'tenant-darey', username: 'SUPER-NEXOS', name: 'Operador Maestro NEXOS', role: 'NEXOS_SUPER_ADMIN', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },

  // DAREY (tenant-darey) - 10 seats contratados / 8 activos
  { id: 'u1', tenant_id: 'tenant-darey', username: 'SUPER-ADMIN', name: 'Administrador General DAREY', role: 'SUPER_ADMIN', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u8', tenant_id: 'tenant-darey', username: 'CENTRAL-01', name: 'Gabriela Rios Mendoza', role: 'ADMIN_ASIGNADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u9', tenant_id: 'tenant-darey', username: 'CENTRAL-02', name: 'Hector Vega Salinas', role: 'ADMIN_ASIGNADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u2', tenant_id: 'tenant-darey', username: 'AJUSTADOR-01', name: 'Carlos Ramirez', role: 'AJUSTADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u3', tenant_id: 'tenant-darey', username: 'AJUSTADOR-02', name: 'Maria Lopez', role: 'AJUSTADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u4', tenant_id: 'tenant-darey', username: 'AJUSTADOR-03', name: 'Pedro Sanchez', role: 'AJUSTADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u5', tenant_id: 'tenant-darey', username: 'REVISOR-01', name: 'Ana Garcia', role: 'REVISOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u6', tenant_id: 'tenant-darey', username: 'REVISOR-SENIOR', name: 'Juan Martinez', role: 'REVISOR_SENIOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },

  // Ajustadores del Centro (tenant-centro) - 5 seats contratados / 3 activos
  { id: 'u-c1', tenant_id: 'tenant-centro', username: 'ADMIN-CENTRO', name: 'Lic. Fernando Cruz', role: 'SUPER_ADMIN', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-02-15T00:00:00Z' },
  { id: 'u-c2', tenant_id: 'tenant-centro', username: 'AJUSTADOR-C1', name: 'Roberto Morales', role: 'AJUSTADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-02-15T00:00:00Z' },
  { id: 'u-c3', tenant_id: 'tenant-centro', username: 'REVISOR-C1', name: 'Patricia Alcocer', role: 'REVISOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-02-15T00:00:00Z' },
];

const CREDENTIALS_DEMO: Record<string, { password: string; userId: string }> = {
  'SUPER-NEXOS':   { password: 'nexos123',   userId: 'u-nexos' },
  'SUPER-ADMIN':   { password: 'admin123',   userId: 'u1' },
  'CENTRAL-01':    { password: 'central123', userId: 'u8' },
  'CENTRAL-02':    { password: 'central123', userId: 'u9' },
  'AJUSTADOR-01':  { password: 'ajust123',   userId: 'u2' },
  'AJUSTADOR-02':  { password: 'ajust123',   userId: 'u3' },
  'AJUSTADOR-03':  { password: 'ajust123',   userId: 'u4' },
  'REVISOR-01':    { password: 'rev123',     userId: 'u5' },
  'REVISOR-SENIOR':{ password: 'rev123',     userId: 'u6' },
  'ADMIN-CENTRO':  { password: 'admin123',   userId: 'u-c1' },
  'AJUSTADOR-C1':  { password: 'ajust123',   userId: 'u-c2' },
  'REVISOR-C1':    { password: 'rev123',     userId: 'u-c3' },
};

function initComponentes(): ComponenteInstance[] {
  return CATALOGO_COMPONENTES.map(comp => {
    const evidencias = comp.slots
      ? comp.slots.map(slot => ({
          id: crypto.randomUUID(),
          slot,
          current_version: 0,
          status: 'PENDIENTE' as EvidenciaStatus,
          versions: [],
        }))
      : [
          {
            id: crypto.randomUUID(),
            current_version: 0,
            status: 'PENDIENTE' as EvidenciaStatus,
            versions: [],
          },
        ];
    return {
      component_id: comp.id,
      evidencias,
    };
  });
}

// ----------------------------------------------------------------
// STORE INTERFACE
// ----------------------------------------------------------------

interface AuthState {
  currentUser: User | null;
  authStep: 'login' | 'totp' | 'mfa_setup' | 'authenticated';
  loginError: string | null;
  pendingUserId: string | null;
}

interface AppState extends AuthState {
  // Multi-Tenant
  tenants: Tenant[];
  currentTenantId: string;
  users: User[];
  expedientes: Expediente[];
  auditLog: AuditEntry[];
  isOffline: boolean;

  // Tenant Actions
  getCurrentTenant: () => Tenant;
  switchTenant: (tenantIdOrSlug: string) => void;
  createTenant: (data: Partial<Tenant>) => Tenant;
  updateTenant: (id: string, data: Partial<Tenant>) => void;
  getTenantSeatUsage: (tenantId?: string) => { used: number; limit: number; available: number; priceMonthly: number; totalMRR: number };

  // Auth
  loginWithPassword: (username: string, password: string) => Promise<boolean>;
  verifyTOTP: (code: string) => Promise<boolean>;
  logout: () => void;
  skipMFASetup: () => void;

  // Expedientes (Tenant-Isolated)
  createExpediente: (data: Partial<Expediente>) => Expediente;
  updateExpediente: (id: string, data: Partial<Expediente>) => void;
  getExpediente: (id: string) => Expediente | undefined;
  assignExpediente: (id: string, adjusterUserId: string, notes?: string) => void;
  iniciarIntegracion: (id: string) => void;
  sendToReview: (id: string) => void;
  closeExpediente: (id: string) => void;

  // Evidencias (SEC-008, SEC-009 SHA-256)
  uploadEvidencia: (expedienteId: string, componentId: number, file: File, slot?: string) => Promise<void>;
  validateEvidencia: (expedienteId: string, componentId: number, evidenciaId: string, action: 'VALIDAR' | 'OBSERVAR' | 'RECHAZAR', comentario?: string) => void;
  requestNoAplica: (expedienteId: string, componentId: number, causa: string, comentario?: string) => void;
  approveNoAplica: (expedienteId: string, componentId: number) => void;

  // Usuarios & Licencias
  createUser: (data: Partial<User>) => { success: boolean; error?: string };
  toggleUserActive: (userId: string) => void;
  addAuditEntry: (action: string, entityType: string, entityId?: string, details?: string) => void;
  calcPercentages: (expediente: Expediente) => { integration: number; validation: number };
  getAdjusters: () => User[];
}

// ----------------------------------------------------------------
// STORE IMPLEMENTATION
// ----------------------------------------------------------------

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // State
      tenants: INITIAL_TENANTS,
      currentTenantId: 'tenant-darey',
      currentUser: null,
      authStep: 'login',
      loginError: null,
      pendingUserId: null,
      users: USERS_DEMO,
      expedientes: [],
      auditLog: [],
      isOffline: !navigator.onLine,

      // ---- TENANT METHODS ----
      getCurrentTenant: () => {
        const { tenants, currentTenantId, currentUser } = get();
        const tid = currentUser?.tenant_id || currentTenantId;
        return tenants.find(t => t.id === tid || t.slug === tid) || tenants[0];
      },

      switchTenant: (tenantIdOrSlug) => {
        const { tenants } = get();
        const found = tenants.find(t => t.id === tenantIdOrSlug || t.slug === tenantIdOrSlug);
        if (found) {
          set({ currentTenantId: found.id });
          get().addAuditEntry('SWITCH_TENANT', 'TENANT', found.id, `Cambio de contexto a ${found.name}`);
        }
      },

      createTenant: (data) => {
        const newTenant: Tenant = {
          id: `tenant-${Date.now()}`,
          slug: data.slug || `despacho-${Date.now().toString(36)}`,
          name: data.name || 'Nuevo Despacho Pericial',
          short_name: data.short_name || 'DESPACHO',
          rfc: data.rfc || '',
          logo_url: data.logo_url || DAREY_ICON_CIRCLE,
          primary_color: data.primary_color || '#0089A9',
          secondary_color: data.secondary_color || '#005A82',
          accent_color: data.accent_color || '#F8C400',
          watermark_text: data.watermark_text || (data.name?.toUpperCase() || 'PERITAJE OFICIAL'),
          watermark_opacity: data.watermark_opacity ?? 0.25,
          plan_seats_limit: data.plan_seats_limit || 5,
          price_per_user_mxn: data.price_per_user_mxn || 490,
          billing_cycle: data.billing_cycle || 'MENSUAL',
          storage_retention_days: data.storage_retention_days || 365,
          status: data.status || 'ACTIVO',
          created_at: new Date().toISOString()
        };
        set(state => ({ tenants: [...state.tenants, newTenant] }));
        get().addAuditEntry('CREAR_INQUILINO', 'TENANT', newTenant.id, `Alta de despacho ${newTenant.name} (${newTenant.plan_seats_limit} seats)`);
        return newTenant;
      },

      updateTenant: (id, data) => {
        set(state => ({
          tenants: state.tenants.map(t => t.id === id ? { ...t, ...data } : t)
        }));
        get().addAuditEntry('ACTUALIZAR_INQUILINO', 'TENANT', id, JSON.stringify(data));
      },

      getTenantSeatUsage: (tenantId) => {
        const { tenants, users, currentTenantId } = get();
        const tid = tenantId || currentTenantId;
        const tenant = tenants.find(t => t.id === tid) || tenants[0];
        const activeUsers = users.filter(u => u.tenant_id === tenant.id && u.active);
        const used = activeUsers.length;
        const limit = tenant.plan_seats_limit;
        const available = Math.max(0, limit - used);
        const priceMonthly = used * tenant.price_per_user_mxn;
        const totalMRR = tenants.reduce((acc, t) => {
          const tActive = users.filter(u => u.tenant_id === t.id && u.active).length;
          return acc + (tActive * t.price_per_user_mxn);
        }, 0);
        return { used, limit, available, priceMonthly, totalMRR };
      },

      // ---- AUTH ----
      loginWithPassword: async (username, password) => {
        set({ loginError: null });
        const clean = username.trim().toUpperCase();
        const cred = CREDENTIALS_DEMO[clean];
        if (!cred || cred.password !== password) {
          set({ loginError: 'Usuario o contrasena incorrectos' });
          return false;
        }
        const user = get().users.find(u => u.id === cred.userId);
        if (!user || !user.active) {
          set({ loginError: 'Usuario inactivo o no registrado en este inquilino' });
          return false;
        }

        // Automatic tenant switch on login
        if (user.tenant_id) {
          set({ currentTenantId: user.tenant_id });
        }

        set({ pendingUserId: user.id });
        if (user.mfa_enabled) {
          set({ authStep: 'totp' });
        } else {
          set({ authStep: 'mfa_setup' });
        }
        return true;
      },

      verifyTOTP: async (code) => {
        const { pendingUserId, users } = get();
        if (!pendingUserId) return false;
        const user = users.find(u => u.id === pendingUserId);
        if (!user) return false;
        if (code.length === 6) {
          set({
            currentUser: user,
            authStep: 'authenticated',
            pendingUserId: null,
            loginError: null,
            currentTenantId: user.tenant_id || get().currentTenantId
          });
          get().addAuditEntry('LOGIN', 'USER', user.id, `Inicio de sesion 2FA en inquilino ${user.tenant_id}`);
          return true;
        }
        return false;
      },

      logout: () => {
        const { currentUser } = get();
        if (currentUser) {
          get().addAuditEntry('LOGOUT', 'USER', currentUser.id, 'Cierre de sesion');
        }
        set({ currentUser: null, authStep: 'login', pendingUserId: null, loginError: null });
      },

      skipMFASetup: () => {
        const { pendingUserId, users } = get();
        if (!pendingUserId) return;
        const user = users.find(u => u.id === pendingUserId);
        if (!user) return;
        set({
          currentUser: user,
          authStep: 'authenticated',
          pendingUserId: null,
          loginError: null,
          currentTenantId: user.tenant_id || get().currentTenantId
        });
      },

      // ---- EXPEDIENTES ----
      createExpediente: (data) => {
        const { currentTenantId, currentUser } = get();
        const tenantId = currentUser?.tenant_id || currentTenantId;
        const newExp: Expediente = {
          id: crypto.randomUUID(),
          tenant_id: tenantId,
          numero_siniestro: data.numero_siniestro || 'SIN-000',
          fecha_siniestro: data.fecha_siniestro || new Date().toISOString().slice(0, 10),
          fecha_apertura: new Date().toISOString(),
          aseguradora: data.aseguradora || '',
          poliza: data.poliza || '',
          folio_dua: data.folio_dua || '',
          reporte: data.reporte,
          asegurado: data.asegurado || { nombre: '' },
          vehiculo_asegurado: data.vehiculo_asegurado || { placas: '' },
          tiene_tercero: data.tiene_tercero ?? false,
          tercero: data.tercero,
          vehiculo_tercero: data.vehiculo_tercero,
          created_by: currentUser?.id || 'u8',
          assigned_to: data.assigned_to,
          assigned_at: data.assigned_to ? new Date().toISOString() : undefined,
          assigned_by: data.assigned_to ? (currentUser?.id || 'u8') : undefined,
          assignment_notes: data.assignment_notes,
          status: data.assigned_to ? 'ASIGNADO' : 'BORRADOR',
          archival_tier: 'HOT',
          integration_percent: 0,
          validation_percent: 0,
          source_mode: 'ONLINE',
          componentes: initComponentes(),
          observaciones_abiertas: 0,
          ...data,
        };
        set(state => ({ expedientes: [newExp, ...state.expedientes] }));
        get().addAuditEntry('CREAR_EXPEDIENTE', 'EXPEDIENTE', newExp.id, `Siniestro #${newExp.numero_siniestro} [Inquilino: ${tenantId}]`);
        return newExp;
      },

      updateExpediente: (id, data) => {
        set(state => ({
          expedientes: state.expedientes.map(e => {
            if (e.id !== id) return e;
            const updated = { ...e, ...data };
            const { integration, validation } = get().calcPercentages(updated);
            return { ...updated, integration_percent: integration, validation_percent: validation };
          }),
        }));
      },

      getExpediente: (id) => get().expedientes.find(e => e.id === id),

      assignExpediente: (id, adjusterUserId, notes) => {
        const { currentUser, users } = get();
        const adjuster = users.find(u => u.id === adjusterUserId);
        get().updateExpediente(id, {
          assigned_to: adjusterUserId,
          assigned_at: new Date().toISOString(),
          assigned_by: currentUser?.id || 'system',
          assignment_notes: notes,
          status: 'ASIGNADO',
        });
        get().addAuditEntry('ASIGNAR_EXPEDIENTE', 'EXPEDIENTE', id, `Asignado a ${adjuster?.name || adjusterUserId}`);
      },

      iniciarIntegracion: (id) => {
        const { currentUser } = get();
        get().updateExpediente(id, { status: 'EN_INTEGRACION' });
        get().addAuditEntry('INICIAR_INTEGRACION', 'EXPEDIENTE', id, `Ajustador ${currentUser?.name || currentUser?.username} en escena`);
      },

      sendToReview: (id) => {
        const exp = get().expedientes.find(e => e.id === id);
        const newStatus: ExpedienteStatus = exp?.status === 'CON_OBSERVACIONES' || exp?.status === 'EN_CORRECCION' ? 'REENVIADO' : 'LISTO_PARA_REVISION';
        get().updateExpediente(id, { status: newStatus, submitted_at: new Date().toISOString() });
        get().addAuditEntry('ENVIAR_REVISION', 'EXPEDIENTE', id, `Estado cambiado a ${newStatus}`);
      },

      closeExpediente: (id) => {
        get().updateExpediente(id, { status: 'CERRADO', closed_at: new Date().toISOString(), locked_at: new Date().toISOString(), archival_tier: 'WARM' });
        get().addAuditEntry('CERRAR_EXPEDIENTE', 'EXPEDIENTE', id, 'Expediente cerrado, sellado y bloqueado (Tier WARM)');
      },

      // ---- EVIDENCIA CON SHA-256 (SEC-008, SEC-009) ----
      uploadEvidencia: async (expedienteId, componentId, file, slot) => {
        const { currentUser } = get();
        const fileUrl = URL.createObjectURL(file);
        const sha256Hash = await calculateSHA256(file);

        set(state => {
          const exp = state.expedientes.find(e => e.id === expedienteId);
          if (!exp) return state;

          const updatedComponentes = exp.componentes.map(c => {
            if (c.component_id !== componentId) return c;
            let foundEv = slot ? c.evidencias.find(e => e.slot === slot) : c.evidencias[0];

            const newVersion = {
              version: (foundEv?.current_version || 0) + 1,
              file_url: fileUrl,
              file_name: `EVIDENCIA_${Date.now()}_${file.name}`,
              file_type: file.type || 'image/jpeg',
              file_size: file.size,
              sha256_hash: sha256Hash,
              captured_at: new Date().toISOString(),
              uploaded_at: new Date().toISOString(),
              uploaded_by: currentUser?.id || 'anonymous',
              status: 'CARGADA' as EvidenciaStatus,
              validaciones: [],
              hallazgos: [],
            };

            let updatedEvidencias;
            if (foundEv) {
              updatedEvidencias = c.evidencias.map(e =>
                e.id === foundEv!.id
                  ? {
                      ...e,
                      current_version: newVersion.version,
                      status: 'CARGADA' as EvidenciaStatus,
                      versions: [...e.versions, newVersion],
                    }
                  : e
              );
            } else {
              const newEv = {
                id: crypto.randomUUID(),
                slot: slot as any,
                current_version: 1,
                status: 'CARGADA' as EvidenciaStatus,
                versions: [newVersion],
              };
              updatedEvidencias = [...c.evidencias, newEv];
            }

            return { ...c, evidencias: updatedEvidencias };
          });

          const updatedExp = { ...exp, componentes: updatedComponentes };
          const { integration, validation } = get().calcPercentages(updatedExp);

          return {
            expedientes: state.expedientes.map(e =>
              e.id === expedienteId
                ? { ...updatedExp, integration_percent: integration, validation_percent: validation }
                : e
            ),
          };
        });

        get().addAuditEntry('UPLOAD_EVIDENCIA', 'EVIDENCIA', expedienteId, `Comp ${componentId} ${slot || ''} [SHA256: ${sha256Hash.slice(0, 12)}...]`);
      },

      validateEvidencia: (expedienteId, componentId, evidenciaId, action, comentario) => {
        const { currentUser } = get();
        const newStatus: EvidenciaStatus = action === 'VALIDAR' ? 'VALIDADA' : action === 'OBSERVAR' ? 'OBSERVADA' : 'RECHAZADA';

        set(state => {
          const exp = state.expedientes.find(e => e.id === expedienteId);
          if (!exp) return state;

          const updatedComponentes: ComponenteInstance[] = exp.componentes.map(c => {
            if (c.component_id !== componentId) return c;
            return {
              ...c,
              evidencias: c.evidencias.map(e => {
                if (e.id !== evidenciaId) return e;
                const lastVer = e.versions[e.versions.length - 1];
                const newValidacion: Validacion = {
                  id: crypto.randomUUID(),
                  dimension: 'CALIDAD',
                  resultado: action === 'VALIDAR' ? 'OK' : action === 'OBSERVAR' ? 'OBSERVACION' : 'RECHAZO',
                  comentario: comentario,
                  validado_por: currentUser?.id || '',
                  created_at: new Date().toISOString(),
                };
                const updatedVer = lastVer ? {
                  ...lastVer,
                  status: newStatus,
                  observacion: comentario,
                  revisado_por: currentUser?.id,
                  validaciones: [...lastVer.validaciones, newValidacion],
                } : lastVer;
                return {
                  ...e,
                  status: newStatus,
                  versions: [...e.versions.slice(0, -1), updatedVer],
                };
              }),
            };
          });

          let obsCount = 0;
          updatedComponentes.forEach(c => c.evidencias.forEach(e => { if (e.status === 'OBSERVADA') obsCount++; }));

          const updatedExp = { ...exp, componentes: updatedComponentes, observaciones_abiertas: obsCount };
          const { integration, validation } = get().calcPercentages(updatedExp);

          return {
            expedientes: state.expedientes.map(e =>
              e.id === expedienteId
                ? { ...updatedExp, integration_percent: integration, validation_percent: validation }
                : e
            ),
          };
        });

        get().addAuditEntry('VALIDAR_EVIDENCIA', 'EVIDENCIA', evidenciaId, `${action} en Comp ${componentId}`);
      },

      requestNoAplica: (expedienteId, componentId, causa, comentario) => {
        const { currentUser } = get();
        set(state => ({
          expedientes: state.expedientes.map(e => {
            if (e.id !== expedienteId) return e;
            return {
              ...e,
              componentes: e.componentes.map(c => {
                if (c.component_id !== componentId) return c;
                return {
                  ...c,
                  no_aplica: {
                    causa,
                    comentario,
                    solicitado_por: currentUser?.id || '',
                    solicitado_at: new Date().toISOString(),
                    estado: 'PENDIENTE',
                  },
                };
              }),
            };
          }),
        }));
        get().addAuditEntry('SOLICITAR_NO_APLICA', 'COMPONENTE', `${expedienteId}-${componentId}`, causa);
      },

      approveNoAplica: (expedienteId, componentId) => {
        const { currentUser } = get();
        set(state => ({
          expedientes: state.expedientes.map(e => {
            if (e.id !== expedienteId) return e;
            const updated = {
              ...e,
              componentes: e.componentes.map(c => {
                if (c.component_id !== componentId || !c.no_aplica) return c;
                return {
                  ...c,
                  no_aplica: { ...c.no_aplica, estado: 'APROBADO' as const, aprobado_por: currentUser?.id, aprobado_at: new Date().toISOString() },
                };
              }),
            };
            const { integration, validation } = get().calcPercentages(updated);
            return { ...updated, integration_percent: integration, validation_percent: validation };
          }),
        }));
        get().addAuditEntry('APROBAR_NO_APLICA', 'COMPONENTE', `${expedienteId}-${componentId}`, 'Aprobado por revisor');
      },

      // ---- USUARIOS & CONTROL DE LICENCIAS (PER-SEAT) ----
      createUser: (data) => {
        const { currentTenantId, currentUser, tenants } = get();
        const tenantId = data.tenant_id || currentUser?.tenant_id || currentTenantId;
        const usage = get().getTenantSeatUsage(tenantId);

        if (usage.available <= 0) {
          return {
            success: false,
            error: `Limite de asientos alcanzado (${usage.used}/${usage.limit} usuarios contratados). Solicita ampliacion de plan a NEXOS.`
          };
        }

        const newUser: User = {
          id: `u-${Date.now()}`,
          tenant_id: tenantId,
          username: data.username || '',
          name: data.name || '',
          role: data.role || 'AJUSTADOR',
          mfa_enabled: true,
          mfa_enrolled: false,
          active: true,
          created_at: new Date().toISOString()
        };

        set(state => ({ users: [...state.users, newUser] }));
        get().addAuditEntry('CREAR_USUARIO', 'USER', newUser.id, `${newUser.username} (${newUser.role}) [Inquilino: ${tenantId}]`);
        return { success: true };
      },

      toggleUserActive: (userId) => {
        set(state => ({ users: state.users.map(u => u.id === userId ? { ...u, active: !u.active } : u) }));
      },

      // ---- AUDITORIA (SEC-014) ----
      addAuditEntry: (action, entityType, entityId, details) => {
        const { currentUser, currentTenantId } = get();
        const entry: AuditEntry = {
          id: crypto.randomUUID(),
          tenant_id: currentUser?.tenant_id || currentTenantId,
          user_id: currentUser?.id || 'system',
          username: currentUser?.username || 'SYSTEM',
          action,
          entity_type: entityType,
          entity_id: entityId,
          details,
          created_at: new Date().toISOString()
        };
        set(state => ({ auditLog: [entry, ...state.auditLog].slice(0, 500) }));
      },

      calcPercentages: (expediente) => {
        let aplicables = 0, integrados = 0, validados = 0;
        expediente.componentes.forEach(comp => {
          const catalog = CATALOGO_COMPONENTES.find(c => c.id === comp.component_id);
          if (!catalog) return;
          if (comp.no_aplica?.estado === 'APROBADO') return;
          if (!catalog.obligatorio && comp.evidencias.filter(e => e.status !== 'PENDIENTE').length === 0) return;
          aplicables++;
          if (comp.evidencias.some(e => e.status !== 'PENDIENTE' && e.versions.length > 0)) integrados++;
          if (comp.evidencias.length > 0 && comp.evidencias.every(e => e.status === 'VALIDADA' || e.status === 'NO_APLICA')) validados++;
        });
        return { integration: aplicables > 0 ? Math.round(integrados / aplicables * 100) : 0, validation: aplicables > 0 ? Math.round(validados / aplicables * 100) : 0 };
      },

      getAdjusters: () => {
        const { users, currentTenantId, currentUser } = get();
        const tid = currentUser?.tenant_id || currentTenantId;
        return users.filter(u => u.role === 'AJUSTADOR' && u.active && (currentUser?.role === 'NEXOS_SUPER_ADMIN' || u.tenant_id === tid));
      },
    }),
    {
      name: 'nexos-integrador-v6',
      partialize: (state) => ({
        tenants: state.tenants,
        currentTenantId: state.currentTenantId,
        expedientes: state.expedientes,
        auditLog: state.auditLog,
        users: state.users
      }),
    }
  )
);
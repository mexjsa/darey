// ================================================================
// DAREY Integrador — Store Global (Zustand)
// Flujo: Central (Admin Asignador) → asigna expediente → Adjuster integra
// ================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User, Expediente, AuditEntry, ComponenteInstance,
  EvidenciaStatus, ExpedienteStatus, ReporteAseguradora
} from '@/types';
import { CATALOGO_COMPONENTES } from '@/types';

// ----------------------------------------------------------------
// USUARIOS DEMO
// ----------------------------------------------------------------

const USERS_DEMO: User[] = [
  // Central / Administración
  { id: 'u1', username: 'SUPER-ADMIN', name: 'Administrador General', role: 'SUPER_ADMIN', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u8', username: 'CENTRAL-01', name: 'Gabriela Ríos Mendoza', role: 'ADMIN_ASIGNADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u9', username: 'CENTRAL-02', name: 'Héctor Vega Salinas', role: 'ADMIN_ASIGNADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  // Ajustadores en campo
  { id: 'u2', username: 'AJUSTADOR-01', name: 'Carlos Ramírez', role: 'AJUSTADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u3', username: 'AJUSTADOR-02', name: 'María López', role: 'AJUSTADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u4', username: 'AJUSTADOR-03', name: 'Pedro Sánchez', role: 'AJUSTADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u10', username: 'AJUSTADOR-04', name: 'Daniela Moreno', role: 'AJUSTADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u11', username: 'AJUSTADOR-05', name: 'Luis Fuentes', role: 'AJUSTADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  // Revisores
  { id: 'u5', username: 'REVISOR-01', name: 'Ana García', role: 'REVISOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u6', username: 'REVISOR-SENIOR', name: 'Juan Martínez', role: 'REVISOR_SENIOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'u7', username: 'COORDINADOR', name: 'Sofía Torres', role: 'COORDINADOR', mfa_enabled: true, mfa_enrolled: true, active: true, created_at: '2026-01-01T00:00:00Z' },
];

const CREDENTIALS_DEMO: Record<string, { password: string; userId: string }> = {
  'SUPER-ADMIN':   { password: 'admin123', userId: 'u1' },
  'CENTRAL-01':    { password: 'central123', userId: 'u8' },
  'CENTRAL-02':    { password: 'central123', userId: 'u9' },
  'AJUSTADOR-01':  { password: 'ajust123', userId: 'u2' },
  'AJUSTADOR-02':  { password: 'ajust123', userId: 'u3' },
  'AJUSTADOR-03':  { password: 'ajust123', userId: 'u4' },
  'AJUSTADOR-04':  { password: 'ajust123', userId: 'u10' },
  'AJUSTADOR-05':  { password: 'ajust123', userId: 'u11' },
  'REVISOR-01':    { password: 'rev123', userId: 'u5' },
  'REVISOR-SENIOR':{ password: 'rev123', userId: 'u6' },
  'COORDINADOR':   { password: 'coord123', userId: 'u7' },
};

// ----------------------------------------------------------------
// Inicializar componentes vacíos
// ----------------------------------------------------------------

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
      : [];
    return { component_id: comp.id, evidencias };
  });
}

// ----------------------------------------------------------------
// Expedientes demo pre-cargados
// Todos creados por CENTRAL y asignados a adjusters
// ----------------------------------------------------------------

function makeExpediente(overrides: Partial<Expediente>): Expediente {
  return {
    id: crypto.randomUUID(),
    numero_siniestro: '',
    fecha_siniestro: '',
    fecha_apertura: new Date().toISOString(),
    aseguradora: '',
    poliza: '',
    folio_dua: '',
    asegurado: { nombre: '' },
    vehiculo_asegurado: { placas: '' },
    tiene_tercero: false,
    created_by: 'u8',   // Central-01 por defecto
    status: 'ASIGNADO',
    integration_percent: 0,
    validation_percent: 0,
    source_mode: 'ONLINE',
    componentes: initComponentes(),
    observaciones_abiertas: 0,
    ...overrides,
  };
}

const EXPEDIENTES_DEMO: Expediente[] = [];

// ----------------------------------------------------------------
// STORE
// ----------------------------------------------------------------

interface AuthState {
  currentUser: User | null;
  authStep: 'login' | 'totp' | 'mfa_setup' | 'authenticated';
  loginError: string | null;
  pendingUserId: string | null;
}

interface AppState extends AuthState {
  users: User[];
  expedientes: Expediente[];
  auditLog: AuditEntry[];
  isOffline: boolean;

  // Auth
  loginWithPassword: (username: string, password: string) => Promise<boolean>;
  verifyTOTP: (code: string) => Promise<boolean>;
  logout: () => void;
  skipMFASetup: () => void;

  // Expedientes
  createExpediente: (data: Partial<Expediente>) => Expediente;
  updateExpediente: (id: string, data: Partial<Expediente>) => void;
  getExpediente: (id: string) => Expediente | undefined;
  assignExpediente: (id: string, adjusterUserId: string, notes?: string) => void;
  iniciarIntegracion: (id: string) => void;
  sendToReview: (id: string) => void;
  closeExpediente: (id: string) => void;

  // Evidencia
  uploadEvidencia: (expedienteId: string, componentId: number, file: File, slot?: string) => void;
  validateEvidencia: (expedienteId: string, componentId: number, evidenciaId: string, action: 'VALIDAR' | 'OBSERVAR' | 'RECHAZAR', comentario?: string) => void;
  requestNoAplica: (expedienteId: string, componentId: number, causa: string, comentario?: string) => void;
  approveNoAplica: (expedienteId: string, componentId: number) => void;

  // Usuarios
  createUser: (data: Partial<User> & { password: string }) => void;
  toggleUserActive: (userId: string) => void;

  // Audit
  addAuditEntry: (action: string, entityType: string, entityId?: string, details?: string) => void;

  // Utils
  calcPercentages: (expediente: Expediente) => { integration: number; validation: number };
  getAdjusters: () => User[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      authStep: 'login',
      loginError: null,
      pendingUserId: null,
      users: USERS_DEMO,
      expedientes: EXPEDIENTES_DEMO,
      auditLog: [],
      isOffline: false,

      // ---- AUTH ----
      loginWithPassword: async (username, password) => {
        const creds = CREDENTIALS_DEMO[username];
        if (!creds || creds.password !== password) {
          set({ loginError: 'Usuario o contraseña incorrectos' });
          return false;
        }
        const user = get().users.find(u => u.id === creds.userId);
        if (!user || !user.active) {
          set({ loginError: 'Cuenta inactiva o no encontrada' });
          return false;
        }
        set({ loginError: null, pendingUserId: user.id, authStep: user.mfa_enrolled ? 'totp' : 'mfa_setup' });
        return true;
      },

      verifyTOTP: async (code) => {
        const { pendingUserId, users } = get();
        if (!/^\d{6}$/.test(code)) return false;
        const user = users.find(u => u.id === pendingUserId);
        if (!user) return false;
        set({ currentUser: user, authStep: 'authenticated', pendingUserId: null });
        get().addAuditEntry('LOGIN_EXITOSO', 'AUTH', user.id, `Login MFA: ${user.username}`);
        return true;
      },

      logout: () => {
        const { currentUser } = get();
        if (currentUser) get().addAuditEntry('LOGOUT', 'AUTH', currentUser.id);
        set({ currentUser: null, authStep: 'login', pendingUserId: null, loginError: null });
      },

      skipMFASetup: () => {
        const { pendingUserId, users } = get();
        const user = users.find(u => u.id === pendingUserId);
        if (user) set({ currentUser: user, authStep: 'authenticated', pendingUserId: null });
      },

      // ---- EXPEDIENTES ----
      createExpediente: (data) => {
        const { currentUser } = get();
        const nuevo: Expediente = {
          id: `exp-${Date.now()}`,
          numero_siniestro: '',
          fecha_siniestro: new Date().toISOString().split('T')[0],
          fecha_apertura: new Date().toISOString(),
          aseguradora: '',
          poliza: '',
          folio_dua: '',
          asegurado: { nombre: '' },
          vehiculo_asegurado: { placas: '' },
          tiene_tercero: false,
          created_by: currentUser?.id || 'u1',
          assigned_by: currentUser?.id || 'u1',
          status: 'ASIGNADO',
          integration_percent: 0,
          validation_percent: 0,
          source_mode: 'ONLINE',
          componentes: initComponentes(),
          observaciones_abiertas: 0,
          ...data,
        };
        set(state => ({ expedientes: [...state.expedientes, nuevo] }));
        get().addAuditEntry('CREAR_EXPEDIENTE', 'EXPEDIENTE', nuevo.id,
          `Siniestro ${nuevo.numero_siniestro} creado y asignado a ${nuevo.assigned_to || 'sin asignar'}`);
        return nuevo;
      },

      updateExpediente: (id, data) => {
        set(state => ({
          expedientes: state.expedientes.map(exp => exp.id === id ? { ...exp, ...data } : exp),
        }));
      },

      getExpediente: (id) => get().expedientes.find(e => e.id === id),

      assignExpediente: (id, adjusterUserId, notes) => {
        const { currentUser } = get();
        get().updateExpediente(id, {
          assigned_to: adjusterUserId,
          assigned_by: currentUser?.id,
          assigned_at: new Date().toISOString(),
          assignment_notes: notes,
          status: 'ASIGNADO',
        });
        const adjuster = get().users.find(u => u.id === adjusterUserId);
        get().addAuditEntry('ASIGNAR_EXPEDIENTE', 'EXPEDIENTE', id,
          `Asignado a ${adjuster?.username || adjusterUserId}`);
      },

      iniciarIntegracion: (id) => {
        get().updateExpediente(id, { status: 'EN_INTEGRACION' });
        get().addAuditEntry('INICIAR_INTEGRACION', 'EXPEDIENTE', id, 'Adjuster inició integración en campo');
      },

      sendToReview: (id) => {
        const exp = get().getExpediente(id);
        if (!exp) return;
        const { integration, validation } = get().calcPercentages(exp);
        get().updateExpediente(id, {
          status: 'LISTO_PARA_REVISION',
          integration_percent: integration,
          validation_percent: validation,
          submitted_at: new Date().toISOString(),
        });
        get().addAuditEntry('ENVIAR_REVISION', 'EXPEDIENTE', id, `Siniestro ${exp.numero_siniestro} enviado a revisión`);
      },

      closeExpediente: (id) => {
        get().updateExpediente(id, {
          status: 'CERRADO',
          closed_at: new Date().toISOString(),
          locked_at: new Date().toISOString(),
        });
        get().addAuditEntry('CERRAR_EXPEDIENTE', 'EXPEDIENTE', id);
      },

      // ---- EVIDENCIA ----
      uploadEvidencia: (expedienteId, componentId, file, slotParam) => {
        const { currentUser, calcPercentages } = get();
        const url = URL.createObjectURL(file);
        const now = new Date().toISOString();

        set(state => ({
          expedientes: state.expedientes.map(exp => {
            if (exp.id !== expedienteId) return exp;
            const componentes = exp.componentes.map(comp => {
              if (comp.component_id !== componentId) return comp;
              const slot = slotParam as any;
              if (slot) {
                const existing = comp.evidencias.find(e => e.slot === slot);
                if (existing) {
                  const newVer: any = { version: existing.versions.length + 1, file_url: url, file_name: file.name, file_type: file.type, file_size: file.size, captured_at: now, uploaded_at: now, uploaded_by: currentUser?.id || 'u1', status: 'CARGADA', validaciones: [], hallazgos: [] };
                  return { ...comp, evidencias: comp.evidencias.map(e => e.slot === slot ? { ...e, status: 'CARGADA' as EvidenciaStatus, current_version: newVer.version, versions: [...e.versions, newVer] } : e) };
                }
              }
              const newEv: any = { id: crypto.randomUUID(), slot: slot || undefined, current_version: 1, status: 'CARGADA' as EvidenciaStatus, versions: [{ version: 1, file_url: url, file_name: file.name, file_type: file.type, file_size: file.size, captured_at: now, uploaded_at: now, uploaded_by: currentUser?.id || 'u1', status: 'CARGADA' as EvidenciaStatus, validaciones: [], hallazgos: [] }] };
              return { ...comp, evidencias: [...comp.evidencias, newEv] };
            });
            const updated = { ...exp, componentes, status: exp.status === 'ASIGNADO' ? 'EN_INTEGRACION' as ExpedienteStatus : exp.status };
            const { integration, validation } = calcPercentages(updated);
            return { ...updated, integration_percent: integration, validation_percent: validation };
          }),
        }));
        get().addAuditEntry('CARGAR_EVIDENCIA', 'EVIDENCIA', expedienteId, `Comp ${componentId}: ${file.name}`);
      },

      validateEvidencia: (expedienteId, componentId, evidenciaId, action, comentario) => {
        const { currentUser } = get();
        const statusMap = { VALIDAR: 'VALIDADA', OBSERVAR: 'OBSERVADA', RECHAZAR: 'RECHAZADA' } as const;
        const newStatus = statusMap[action] as EvidenciaStatus;
        set(state => ({
          expedientes: state.expedientes.map(exp => {
            if (exp.id !== expedienteId) return exp;
            let obsAbiertas = exp.observaciones_abiertas;
            const componentes = exp.componentes.map(comp => {
              if (comp.component_id !== componentId) return comp;
              const evidencias = comp.evidencias.map(ev => {
                if (ev.id !== evidenciaId) return ev;
                if (newStatus === 'OBSERVADA' || newStatus === 'RECHAZADA') obsAbiertas++;
                const versions = ev.versions.map((v, i) => i !== ev.versions.length - 1 ? v : { ...v, status: newStatus, revisado_por: currentUser?.id, observacion: comentario });
                return { ...ev, status: newStatus, versions };
              });
              return { ...comp, evidencias };
            });
            return { ...exp, componentes, observaciones_abiertas: obsAbiertas };
          }),
        }));
        get().addAuditEntry(`EVIDENCIA_${action}`, 'EVIDENCIA', evidenciaId, comentario);
      },

      requestNoAplica: (expedienteId, componentId, causa, comentario) => {
        const { currentUser } = get();
        set(state => ({
          expedientes: state.expedientes.map(exp => {
            if (exp.id !== expedienteId) return exp;
            const componentes = exp.componentes.map(comp => comp.component_id !== componentId ? comp : { ...comp, no_aplica: { causa, comentario, solicitado_por: currentUser?.id || '', solicitado_at: new Date().toISOString(), estado: 'PENDIENTE' as const } });
            return { ...exp, componentes };
          }),
        }));
        get().addAuditEntry('SOLICITAR_NO_APLICA', 'COMPONENTE', expedienteId, `Comp ${componentId}: ${causa}`);
      },

      approveNoAplica: (expedienteId, componentId) => {
        const { currentUser } = get();
        set(state => ({
          expedientes: state.expedientes.map(exp => {
            if (exp.id !== expedienteId) return exp;
            const componentes = exp.componentes.map(comp => comp.component_id !== componentId || !comp.no_aplica ? comp : { ...comp, no_aplica: { ...comp.no_aplica, aprobado_por: currentUser?.id, aprobado_at: new Date().toISOString(), estado: 'APROBADO' as const } });
            return { ...exp, componentes };
          }),
        }));
      },

      // ---- USUARIOS ----
      createUser: (data) => {
        const newUser: User = { id: `u-${Date.now()}`, username: data.username || '', name: data.name || '', role: data.role || 'AJUSTADOR', mfa_enabled: true, mfa_enrolled: false, active: true, created_at: new Date().toISOString() };
        set(state => ({ users: [...state.users, newUser] }));
        get().addAuditEntry('CREAR_USUARIO', 'USER', newUser.id, `${newUser.username} (${newUser.role})`);
      },

      toggleUserActive: (userId) => {
        set(state => ({ users: state.users.map(u => u.id === userId ? { ...u, active: !u.active } : u) }));
      },

      // ---- AUDIT ----
      addAuditEntry: (action, entityType, entityId, details) => {
        const { currentUser } = get();
        const entry: AuditEntry = { id: crypto.randomUUID(), user_id: currentUser?.id || 'system', username: currentUser?.username || 'SYSTEM', action, entity_type: entityType, entity_id: entityId, details, created_at: new Date().toISOString() };
        set(state => ({ auditLog: [entry, ...state.auditLog].slice(0, 500) }));
      },

      // ---- UTILS ----
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

      getAdjusters: () => get().users.filter(u => u.role === 'AJUSTADOR' && u.active),
    }),
    {
      name: 'darey-integrador-v5',
      partialize: (state) => ({ expedientes: state.expedientes, auditLog: state.auditLog, users: state.users }),
    }
  )
);

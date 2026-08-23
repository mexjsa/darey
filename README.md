# DAREY — Integrador de Expedientes

Sistema web para integración, validación, corrección, cierre y exportación de expedientes de siniestros.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS 3
- Zustand (estado + persistencia localStorage)
- React Router v6
- Lucide React (íconos)

## Instalación y arranque

```bash
npm install
npm run dev
```

La app abre en http://localhost:3000

## Credenciales de demo

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| SUPER-ADMIN | admin123 | Super Administrador |
| AJUSTADOR-01 | ajust123 | Ajustador |
| AJUSTADOR-02 | ajust123 | Ajustador |
| REVISOR-01 | rev123 | Revisor |
| COORDINADOR | coord123 | Coordinador |

**TOTP:** cualquier código de 6 dígitos (ej. `123456`) en modo demo.

## Estructura del proyecto

```
src/
  types/index.ts       — Tipos TypeScript (PRD §27)
  store/index.ts       — Estado global Zustand + datos demo
  utils/helpers.ts     — Helpers de formato y estilos
  styles/globals.css   — Identidad visual DAREY
  components/
    Layout.tsx         — Sidebar + header + navegación
  pages/
    Login.tsx          — Login + TOTP + MFA setup
    Dashboard.tsx      — Dashboard por rol
    Expedientes.tsx    — Lista con filtros
    NuevoExpediente.tsx — Formulario nuevo expediente
    ExpedienteDetail.tsx — Integrador 5 bloques / 17 componentes
    ColaRevision.tsx   — Cola de revisión (revisores)
    Administracion.tsx — CRUD usuarios + auditoría
```

## Próximos pasos
1. Conectar Supabase (tablas SQL en `/supabase/schema.sql`)
2. Auth real con Supabase Auth + TOTP (speakeasy o similar)
3. Storage en Supabase Storage (bucket privado)
4. Deploy a Cloudflare Pages
5. Cloudflare Access para demo protegida en dominio

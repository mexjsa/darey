# MANUAL DE OPERACIÓN — SISTEMA INTEGRADOR DE EXPEDIENTES DAREY
**Cliente:** DAREY Ajustadores Profesionales S.C.  
**Versión del Manual:** 1.0 (Definitiva)  
**Fecha de Emisión:** 23 de agosto de 2026  
**Clasificación:** Documento Operativo Interno  

---

## ÍNDICE DE CONTENIDOS

1. [Introducción y Jerarquía Documental](#1-introducción-y-jerarquía-documental)
2. [Matriz de Roles y Responsabilidades](#2-matriz-de-roles-y-responsabilidades)
3. [Módulo 1: Inicio de Sesión y Seguridad (Login + 2FA)](#3-módulo-1-inicio-de-sesión-y-seguridad)
4. [Módulo 2: Central de Despacho y Asignación de Siniestros](#4-módulo-2-central-de-despacho-y-asignación-de-siniestros)
5. [Módulo 3: Operación en Campo e Integración de Evidencias (17 Componentes)](#5-módulo-3-operación-en-campo-e-integración-de-evidencias)
6. [Módulo 4: Mesa de Control y Validación Documental](#6-módulo-4-mesa-de-control-y-validación-documental)
7. [Módulo 5: Gestión de Observaciones, Correcciones y Nueva Versión](#7-módulo-5-gestión-de-observaciones-correcciones-y-nueva-versión)
8. [Módulo 6: Cierre, Bloqueo y Exportación del Expediente Consolidado](#8-módulo-6-cierre-bloqueo-y-exportación-del-expediente-consolidado)
9. [Módulo 7: Administración del Sistema y Auditoría](#9-módulo-7-administración-del-sistema-y-auditoría)
10. [Módulo 8: Continuidad Offline e Importación de Contingencia](#10-módulo-8-continuidad-offline-e-importación-de-contingencia)

---

## 1. INTRODUCCIÓN Y JERARQUÍA DOCUMENTAL

El sistema integrador de DAREY no concibe un expediente como una simple carpeta de fotos, sino como una **cadena de custodia y validación documental** con la siguiente jerarquía estricta:

```
EXPEDIENTE (Siniestro único)
 └── BLOQUES (5 Bloques oficiales)
      └── COMPONENTES (17 Componentes base)
           └── EVIDENCIAS (Slots fijos o N evidencias)
                └── VERSIONES (Historial inmutable v1, v2...)
                     └── VALIDACIONES (Existencia, Calidad, Legibilidad, etc.)
                          └── HALLAZGOS (Catálogo de 25 observaciones)
```

---

## 2. MATRIZ DE ROLES Y RESPONSABILIDADES

| Rol | Usuario Tipo | Funciones Principales |
|---|---|---|
| **Admin Asignador (Central)** | `CENTRAL-01` / `CENTRAL-02` | Recibe reportes de aseguradoras, registra siniestro, fija ubicación y prioridad, asigna ajustador en campo. |
| **Ajustador en Campo** | `AJUSTADOR-01` al `10` | Consulta asignaciones, acude a ubicación GPS, fotografía 17 componentes, registra DUA y envía a revisión. |
| **Revisor / Mesa de Control** | `REVISOR-01`, `REVISOR_SENIOR` | Abre cola de revisión, evalúa evidencia por evidencia, aprueba/observa/rechaza, aprueba solicitudes de "No Aplica". |
| **Coordinador** | `COORDINADOR` | Supervisa tiempos de respuesta, reasigna casos críticos, autoriza reaperturas excepcionales. |
| **Super Administrador** | `SUPER-ADMIN` | Altas/bajas de usuarios, reinicio de 2FA, configuración de marca de agua y consulta de auditoría completa. |

---

## 3. MÓDULO 1: INICIO DE SESIÓN Y SEGURIDAD

### Objetivo
Garantizar acceso protegido de dos pasos para todo el personal operativo.

### Procedimiento:
1. Acceder a la URL de la plataforma: `https://app.dareyajustadores.com` (o `http://localhost:3000` en entorno local).
2. **Paso 1 (Credenciales):**
   * Ingresar **Usuario** (ej. `CENTRAL-01`, `AJUSTADOR-01`).
   * Ingresar **Contraseña**.
   * El sistema valida automáticamente la protección anti-bots **Cloudflare Turnstile**.
   * Presionar **Iniciar sesión**.
3. **Paso 2 (Verificación de 2 Pasos / TOTP):**
   * Abrir en el celular la app Authenticator (*Google Authenticator, Microsoft Authenticator o Authy*).
   * Ingresar el código dinámico de **6 dígitos** generado por la app.
   * Presionar **Verificar código**.
4. **Enrolamiento Inicial (Primera vez):**
   * El sistema genera un código QR exclusivo.
   * Escanear con la app Authenticator y confirmar con el primer código temporal.

> ⚠️ **Políticas de Seguridad:** 5 intentos fallidos consecutivos bloquean temporalmente la cuenta. La sesión expira tras 30 minutos de inactividad.

---

## 4. MÓDULO 2: CENTRAL DE DESPACHO Y ASIGNACIÓN

### Objetivo
Registrar la llamada/aviso de la aseguradora y despachar al ajustador más cercano.

### Procedimiento de Alta:
1. Iniciar sesión como `CENTRAL-01` o `SUPER-ADMIN`.
2. En el menú superior o lateral, hacer clic en el botón azul **`+ Nuevo reporte / Asignar`**.
3. **Sección 1 — Reporte de Aseguradora:**
   * **Número de Siniestro:** Folio oficial (ej. `696213`).
   * **Número de Reporte:** Folio interno enviado por la aseguradora.
   * **Fecha y Hora del Siniestro:** Registro temporal del incidente.
   * **Aseguradora:** Seleccionar del catálogo (*Afirme, General de Seguros, El Águila, etc.*).
   * **Prioridad:** Seleccionar `NORMAL`, `URGENTE` o `CATASTROFE`.
4. **Sección 2 — Ubicación del Siniestro:**
   * Escribir dirección completa, cruces o referencias carreteras exactas.
5. **Sección 3 y 4 — Asegurado y Vehículo Asegurado:**
   * Nombre del asegurado y teléfono de contacto.
   * **Placas**, color, marca, modelo y año según reporte de la aseguradora.
6. **Sección 5 — Tercero Involucrado (Toggle):**
   * Si la aseguradora reportó tercero, activar la casilla. Si los datos aún no se conocen, dejar en blanco para que el ajustador los recabe en sitio.
7. **Sección 6 — Asignación:**
   * Seleccionar al ajustador responsable en el selector (ej. `AJUSTADOR-01 — Carlos Ramírez`).
   * Redactar **instrucciones de despacho** (ej. *"Conductor en crisis nerviosa, acudir con pase médico prioritario"*).
8. Presionar **`Registrar y asignar expediente`**. El siniestro queda en estado **`ASIGNADO`**.

---

## 5. MÓDULO 3: OPERACIÓN EN CAMPO (17 COMPONENTES)

### Objetivo
Guía para el ajustador en el lugar de los hechos.

### Procedimiento:
1. El ajustador ingresa a su Dashboard y ve el banner morado con el nuevo siniestro asignado.
2. Al pulsar el siniestro, consulta:
   * **Ubicación con botón GPS:** Toca **`Abrir en Google Maps / GPS`** para navegación punto a punto.
   * **Placas y Color:** Localiza el auto en la escena.
   * **Instrucciones de Central:** Lee las indicaciones específicas.
3. Al llegar al lugar, presiona el botón: **`Llegué a la escena / Iniciar integración`**.
4. Procede a capturar los **17 componentes en estricto orden oficial**:

### Estructura de los 17 Componentes:
* **BLOQUE 1: Declaración del Siniestro**
  * `1. DUA Lado A` (Declaración Única de Accidente cara frontal)
  * `2. DUA Lado B` (Declaración Única de Accidente reverso/firmas)
* **BLOQUE 2: Servicios Derivados**
  * `3. Orden(es) de Taller` (0 a N documentos; solicitar "No Aplica" si no hubo orden)
  * `4. Pase(s) Médico(s)` (0 a N pases; solicitar "No Aplica" si no hay lesionados)
* **BLOQUE 3: Cierre y Registros de Sistema**
  * `5. Captura Conclusión` (Pantalla de cierre en sistema de aseguradora)
  * `6. Captura Encuesta de Servicio`
  * `7. Captura Estimaciones`
* **BLOQUE 4: Evidencia del Vehículo Asegurado**
  * `8. Foto Serie / VIN Asegurado`
  * `9. Foto Licencia Asegurado`
  * `10. Foto Tarjeta de Circulación Asegurado`
  * `11. Fotos 4 Esquinas Asegurado` *(4 slots fijos: Frontal Izquierda, Frontal Derecha, Trasera Izquierda, Trasera Derecha)*
  * `12. Fotos de Daños Asegurado` *(Tomas detalladas y de contexto)*
* **BLOQUE 5: Evidencia del Tercero (Si aplica)**
  * `13. Foto Serie Tercero`
  * `14. Foto Licencia Tercero`
  * `15. Foto Tarjeta Circulación Tercero`
  * `16. Fotos 4 Esquinas Tercero` *(4 slots fijos)*
  * `17. Fotos de Daños Tercero`

5. **Envío a Mesa de Control:** Al completar los requisitos aplicables, pulsar **`Enviar a revisión`**.

---

## 6. MÓDULO 4: MESA DE CONTROL Y VALIDACIÓN DOCUMENTAL

### Objetivo
Evaluación rigurosa por parte del Revisor antes de autorizar el cierre.

### Procedimiento:
1. Iniciar sesión como `REVISOR-01` o `REVISOR_SENIOR`.
2. Acceder a **`Cola de revisión`** en el menú lateral.
3. Seleccionar el expediente a revisar (ordenados por antigüedad y estado `LISTO_PARA_REVISION` o `REENVIADO`).
4. Por cada componente y fotografía:
   * Evaluar: **Existencia, Legibilidad, Consistencia, Calidad fotográfica y Vigencia**.
   * Pulsar los 3 puntos `···` sobre la evidencia:
     * **Validar (Verde):** La evidencia cumple al 100%.
     * **Observar (Ámbar):** Detalle menor que requiere aclaración o foto adicional.
     * **Rechazar (Rojo):** Documento equivocado, foto borrosa o placa no coincidente.
5. **Solicitudes de "No Aplica":** Si el ajustador marcó pases médicos o tercero como no aplicable, el revisor aprueba o rechaza la causa.

---

## 7. MÓDULO 5: GESTIÓN DE CORRECCIONES Y VERSIONES

### Regla de Oro: Principio de Inmutabilidad (PRD §19)
> Una corrección **NUNCA borra el archivo anterior**. Toda sustitución genera una nueva versión `v2`, `v3` conservando el historial completo para auditoría y peritaje.

### Flujo de Corrección:
1. El expediente regresa al ajustador en estado **`CON_OBSERVACIONES`** o **`EN_CORRECCION`**.
2. El ajustador entra al componente observado.
3. Pulsa `···` → **`Nueva versión`** y toma/sube la fotografía corregida.
4. La evidencia pasa a estado `CARGADA (v2)`.
5. El ajustador presiona **`Enviar a revisión`** (el expediente cambia a `REENVIADO`).

---

## 8. MÓDULO 6: CIERRE Y EXPORTACIÓN DEL EXPEDIENTE

### Procedimiento:
1. Una vez que el **`% VALIDACIÓN` alcanza el 100%**, se habilita el botón verde **`Cerrar expediente`** para Coordinadores y Revisores Senior.
2. Al cerrar:
   * El expediente queda en estado **`CERRADO`** y **`BLOQUEADO`** (inmutable).
3. Se habilita el botón **`Exportar PDF`**:
   * **Portada Oficial:** Con número de siniestro en alta legibilidad, fecha, placas, ajustador y logotipo DAREY.
   * **Índice / Matriz:** Resumen de los 17 componentes con su estado de validación.
   * **Evidencias Integradas:** Respetando el orden 1 al 17 con las versiones vigentes.
   * **Marca de Agua (Watermark):** Estampada automáticamente al 25% de opacidad sin tapar números de serie ni firmas.
   * **Nombre de Archivo Normalizado:** `DAREY_EXP_{SINIESTRO}_{FECHA}_{PLACAS}_CERRADO.pdf`.

---

## 9. MÓDULO 7: ADMINISTRACIÓN Y AUDITORÍA

### Funciones exclusivas de `SUPER-ADMIN`:
* **Alta de Usuarios:** Menú *Administración → Usuarios → Nuevo usuario*. Asignar rol (`AJUSTADOR`, `ADMIN_ASIGNADOR`, `REVISOR`, etc.) y contraseña provisional.
* **Activar/Desactivar Cuentas:** Interruptor de estado con un solo clic.
* **Bitácora de Auditoría:** Menú *Administración → Auditoría*. Registra con sello de tiempo quién inició sesión, quién asignó, quién validó, quién rechazó y qué cambios se realizaron.

---

## 10. MÓDULO 8: MODO OFFLINE Y CONTINGENCIA

1. Si el ajustador pierde conectividad celular en carretera o sótano, la app continúa operando con almacenamiento local (*IndexedDB / Service Worker*).
2. El indicador superior cambia a **`Sin conexión`**.
3. Las fotos capturadas se guardan de forma segura con su fecha y hora real de captura (`captured_at`).
4. Al recuperar señal, el sistema sincroniza automáticamente sin duplicar expedientes.

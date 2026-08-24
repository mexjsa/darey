# DIAGRAMA DE ROLES Y FLUJO OPERATIVO DAREY
**Sistema Integrador y Validador de Expedientes Periciales**  
*DAREY Ajustadores Profesionales S.C.*

---

## 1. Diagrama de Flujo Pericial (Ciclo de Mano en Mano)

```mermaid
flowchart TD
    %% Entidades externas y roles
    ASEG[("🏢 Compañía Aseguradora<br/>(Reporte de Siniestro)")]
    
    subgraph S1["1. RECEPCIÓN Y DESPACHO"]
        ADMIN_ASIG["🏢 ADMIN_ASIGNADOR<br/>(Central de Despacho)<br/>• Captura siniestro y póliza<br/>• Fija ubicación GPS y prioridad<br/>• Asigna Ajustador en turno"]
    end

    subgraph S2["2. OPERACIÓN EN CAMPO (MÓVIL)"]
        AJUST["🚗 AJUSTADOR<br/>(Personal en Campo)<br/>• Navegación GPS a la escena<br/>• Llamada directa a cliente<br/>• Captura 17 componentes<br/>• Fotos 4 esquinas fijas<br/>• Solicita 'No Aplica' si procede"]
    end

    subgraph S3["3. MESA DE CONTROL Y AUDITORÍA"]
        REV["🔍 REVISOR<br/>(Mesa de Control)<br/>• Evalúa 5 dimensiones de calidad<br/>• Valida / Observa / Rechaza<br/>• Aprueba solicitudes 'No Aplica'"]
        CORR{"¿Tiene<br/>Observaciones?"}
    end

    subgraph S4["4. DICTAMEN FINAL Y CERTIFICACIÓN"]
        SENIOR["⚖️ REVISOR SENIOR / COORD.<br/>• Certifica 100% de validación<br/>• Cierre y bloqueo inmutable<br/>• Emisión de PDF con Watermark"]
    end

    subgraph S5["5. GOBIERNO Y SEGURIDAD"]
        SUPER["🛡️ SUPER_ADMIN<br/>• Control de usuarios y 2FA<br/>• Configuración de Marca de Agua<br/>• Auditoría inalterable"]
    end

    %% Conexiones
    ASEG -->|"Aviso de Choque"| ADMIN_ASIG
    ADMIN_ASIG -->|"Despacho GPS<br/>(Estado: ASIGNADO)"| AJUST
    AJUST -->|"Integración completa<br/>(Estado: LISTO_REVISIÓN)"| REV
    REV --> CORR
    CORR -- "SÍ (Estado: CON_OBSERVACIONES)" -->|"Solicitud de corrección v2"| AJUST
    CORR -- "NO (Estado: VALIDADO 100%)" --> SENIOR
    SENIOR -->|"Expediente CERRADO normalizado<br/>DAREY_EXP_696213.pdf"| ASEG

    SUPER -.->|"Supervisión y Auditoría"| S1
    SUPER -.->|"Supervisión y Auditoría"| S2
    SUPER -.->|"Supervisión y Auditoría"| S3
    SUPER -.->|"Supervisión y Auditoría"| S4

    %% Estilos
    classDef aseguradora fill:#EBF3F5,stroke:#005A82,stroke-width:2px,color:#005A82;
    classDef central fill:#FFF3E0,stroke:#F5A000,stroke-width:2px,color:#B25E00;
    classDef campo fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20;
    classDef revisor fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px,color:#4A148C;
    classDef senior fill:#E0F7FA,stroke:#0089A9,stroke-width:2px,color:#005A82;
    classDef admin fill:#EDE7F6,stroke:#512DA8,stroke-width:2px,color:#311B92;

    class ASEG aseguradora;
    class ADMIN_ASIG central;
    class AJUST campo;
    class REV revisor;
    class SENIOR senior;
    class SUPER admin;
```

---

## 2. Matriz Ejecutiva de Roles y Responsabilidades

| Rol | Icono | ¿Quién es? | Responsabilidad Principal | Pantalla Clave | Entregable Clave |
|---|:---:|---|---|---|---|
| **`ADMIN_ASIGNADOR`** | 🏢 | Operador de Cabina / Central | Registro de reportes de aseguradoras, ubicación y despacho a ajustador. | *Nuevo reporte / Asignar* | Expediente en estado `ASIGNADO` con coordenadas |
| **`AJUSTADOR`** | 🚗 | Perito Operativo en Campo | Traslado a escena, toma directa con cámara de los 17 componentes periciales. | *Integrador Móvil (5 Bloques)* | Cuadernillo con fotos y DUA integrado |
| **`REVISOR`** | 🔍 | Mesa de Control Pericial | Dictamen evidencia por evidencia bajo 5 criterios (Existencia, Calidad, Vigencia, etc.). | *Cola de Revisión* | Evidencias validadas o notas de corrección |
| **`REVISOR_SENIOR`** | ⚖️ | Auditor Pericial Senior | Autorización de casos graves/pérdidas totales, cierre definitivo y exportación. | *Detalle / Exportar PDF* | PDF Final con Portada DAREY y Marca de Agua |
| **`COORDINADOR`** | 🧭 | Jefe de Operaciones / Zona | Balanceo de cargas, reasignaciones de emergencia y métricas de desempeño. | *Panel de Control / Dashboard* | Supervisión de SLA y resolución de bloqueos |
| **`SUPER_ADMIN`** | 🛡️ | Dirección / Gerencia TI | Gestión de usuarios, restablecimiento de 2FA y bitácora de auditoría legal. | *Administración & Auditoría* | Gobernanza del sistema y registros de trazabilidad |

---

## 3. Las 4 Etapas Clave del Expediente

```
  [1. DESPACHO]          [2. CAMPO]             [3. AUDITORÍA]          [4. CIERRE]
  • Reporte Entrante     • Navegación GPS       • Mesa de Control       • Validación 100%
  • Fija Prioridad       • DUA A y B            • Validar / Observar    • Bloqueo Inmutable
  • Asigna Ajustador     • 4 Esquinas Fijas     • Versiones v1, v2...   • Marca de Agua 25%
  • Estado: ASIGNADO     • Fotos de Daños       • Aprueba 'No Aplica'   • Estado: CERRADO
```

> [!IMPORTANT]
> **Principio de Inmutabilidad DAREY (PRD §19):**  
> Cuando un revisor observa una fotografía y el ajustador toma una nueva foto, el sistema **nunca elimina la foto anterior**. Ambas quedan archivadas en el historial de versiones (`v1`, `v2`) con fecha, hora exacta y autor, garantizando plena validez jurídica ante cualquier controversia con la aseguradora.

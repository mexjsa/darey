'use client';

import { useState } from 'react';

const pillars = [
  {
    icon: 'fa-shield-halved',
    title: 'Experiencia',
    desc: 'Más de 35 años de trayectoria en el sector asegurador, garantizando criterio pericial certero y resolución efectiva de contingencias.'
  },
  {
    icon: 'fa-user-check',
    title: 'Confianza',
    desc: 'Transparencia e integridad en la recopilación de testimonios, inspección documental y dictámenes técnicos claros e imparciales.'
  },
  {
    icon: 'fa-gauge-high',
    title: 'Agilidad',
    desc: 'Arribo oportuno en sitio reduciendo tiempos de espera, porque sabemos que cada minuto define la satisfacción del asegurado.'
  },
  {
    icon: 'fa-handshake',
    title: 'Compromiso',
    desc: 'Acompañamiento humano integral y protección constante de la imagen y prestigio de las aseguradoras asociadas.'
  }
];

const processes = [
  {
    num: '01',
    title: 'Recepción y Contacto Inmediato',
    desc: 'Recepción del folio, validación preliminar de póliza y cobertura, y llamada inmediata con el conductor o asegurado.'
  },
  {
    num: '02',
    title: 'Atención y Presencia en Sitio',
    desc: 'Arribo puntual al lugar del siniestro, identificación de vehículos involucrados y asesoría presencial ante autoridades y terceros.'
  },
  {
    num: '03',
    title: 'Investigación y Evidencia Técnica',
    desc: 'Levantamiento pericial, toma de declaraciones, registro fotográfico en alta resolución y análisis de dinámica del siniestro.'
  },
  {
    num: '04',
    title: 'Entrega Documentada & Cuadernillo',
    desc: 'Integración rigurosa del cuadernillo digital con dictamen de responsabilidad para la pronta liquidación de la aseguradora.'
  }
];

const regions = [
  {
    zone: 'ZONA 01',
    title: 'San Luis Potosí',
    desc: 'Capital del estado, zona metropolitana, sus 58 municipios y colindancias carreteras estratégicas.'
  },
  {
    zone: 'ZONA 02',
    title: 'Aguascalientes',
    desc: 'Cobertura integral en los 11 municipios y corredores limítrofes con Zacatecas y Jalisco.'
  },
  {
    zone: 'ZONA 03',
    title: 'Baja California Sur',
    desc: 'Presencia activa en La Paz, Los Cabos, Todos Santos, Ciudad Constitución y Loreto.'
  },
  {
    zone: 'ZONA 04',
    title: 'Red Nacional Extendida',
    desc: 'Presencia operativa en Colima, Tepic y coordinación interestatal a través de nuestra red de ajustadores.'
  }
];

const partners = [
  { name: 'Seguros Afirme', icon: 'fa-building-shield' },
  { name: 'Más Soluciones', icon: 'fa-handshake-angle' },
  { name: 'Movilidad Transporte Urbano & Colectivo', icon: 'fa-bus-simple' },
  { name: 'Seguros El Águila', icon: 'fa-shield-halved' },
  { name: 'General de Seguros', icon: 'fa-building-columns' },
  { name: 'Grupo Zeus', icon: 'fa-award' }
];

export default function Home() {
  const [formData, setFormData] = useState({
    nombreContacto: '',
    empresa: '',
    tipoOrganizacion: '',
    telefono: '',
    correo: '',
    zonaInteres: 'San Luis Potosí y Colindancias',
    solucionRequerida: 'Ajuste de Siniestros en Sitio y Cabina',
    mensaje: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = '524440000000';
    let msg = '*🤝 NUEVA PROPUESTA DE ALIANZA - DAREY S.C. 🤝*\n';
    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    msg += `👤 *Contacto:* ${formData.nombreContacto}\n`;
    msg += `🏢 *Empresa:* ${formData.empresa}\n`;
    msg += `📌 *Giro / Organización:* ${formData.tipoOrganizacion}\n`;
    msg += `📞 *Teléfono:* ${formData.telefono}\n`;
    msg += `✉️ *Correo:* ${formData.correo}\n`;
    msg += `📍 *Zona de Interés:* ${formData.zonaInteres}\n`;
    msg += `⚙️ *Solución Requerida:* ${formData.solucionRequerida}\n`;
    if (formData.mensaje) {
      msg += `📝 *Comentarios / Requerimientos:* ${formData.mensaje}\n`;
    }
    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    msg += '_Solicitud de alianza recibida desde portal web DAREY_';

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`, '_blank');
  };

  return (
    <main>
      {/* Header */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="#inicio" className="brand-logo" aria-label="Inicio DAREY">
            <img src="/darey-logo-transparent.png" alt="DAREY Ajustadores Profesionales S.C." />
          </a>
          <nav className="nav-menu">
            <a href="#inicio" className="nav-link">Inicio</a>
            <a href="#nosotros" className="nav-link">Nosotros</a>
            <a href="#valores" className="nav-link">Compromisos</a>
            <a href="#proceso" className="nav-link">Proceso</a>
            <a href="#cobertura" className="nav-link">Cobertura</a>
            <a href="#socios" className="nav-link">Socios</a>
            <a href="#alianza" className="btn-cta">
              <span>Alianza Comercial</span>
              <span className="btn-icon-circle"><i className="fa-solid fa-chevron-right"></i></span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="inicio">
        <div className="hero-overlay"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <div className="badge-tagline">
              <i className="fa-solid fa-shield-halved"></i> Profesionalismo en movimiento
            </div>
            <h1 className="hero-title">
              Respuesta oportuna.<br />
              <span className="highlight-cian">Atención humana.</span>
            </h1>
            <p className="hero-description">
              En DAREY conectamos experiencia, precisión y confianza para brindar soluciones profesionales en ajuste de siniestros, cuidando en todo momento la imagen de nuestros socios comerciales.
            </p>
            <div className="hero-actions">
              <a href="#alianza" className="btn-cta btn-yellow">
                <span>Conectar como socio comercial</span>
                <span className="btn-icon-circle"><i className="fa-solid fa-arrow-right"></i></span>
              </a>
              <a href="#nosotros" className="btn-ghost">
                <i className="fa-regular fa-compass"></i> Conocer DAREY
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-stats-grid">
              <div className="stat-box">
                <div className="stat-number">35+</div>
                <div className="stat-label">Años de experiencia combinada en el sector asegurador</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Atención y coordinación operativa en campo</div>
              </div>
            </div>
            <div className="hero-card-footer">
              <img src="/darey-icon.jpg" alt="Icono DAREY" />
              <div className="hero-card-footer-text">
                <strong>Soluciones Periciales para Socios</strong>
                San Luis Potosí, Aguascalientes, BCS y Red Nacional
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quienes Somos */}
      <section className="section about-section" id="nosotros">
        <div className="container">
          <div className="about-grid">
            <div>
              <span className="section-kicker">Nuestra Identidad</span>
              <h2 className="section-title">Experiencia que se traduce en <em>confianza y precisión.</em></h2>
              <p className="section-subtitle" style={{ marginBottom: '24px' }}>
                DAREY es una empresa con sólida trayectoria en el mercado asegurador, respaldada por más de 35 años de experiencia ofreciendo soluciones técnicas y periciales de alto nivel.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
                Entendemos a profundidad las exigencias de las compañías aseguradoras y las sensibilidades del asegurado. Por ello, cada intervención combina rigurosidad técnica, investigación objetiva, comunicación transparente y un respeto irrestricto por la reputación institucional de nuestros socios.
              </p>
            </div>

            <div className="about-badge-card">
              <p className="quote-box">
                "En DAREY conectamos experiencia, precisión y confianza para brindar soluciones profesionales en ajuste de siniestros."
              </p>
              <div className="quote-author">DAREY Ajustadores Profesionales S.C.</div>
              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="/darey-icon-circle.jpg" alt="DAREY Identidad" style={{ width: '54px', height: '54px', borderRadius: '50%' }} />
                <div>
                  <strong style={{ color: 'var(--azul-profundo)', display: 'block', fontSize: '15px' }}>Profesionalismo en movimiento</strong>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Estándar de calidad pericial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="section pillars-section" id="valores">
        <div className="container">
          <div className="pillars-header">
            <span className="section-kicker">Pilares Estratégicos</span>
            <h2 className="section-title">Valores que guían cada <em>intervención</em></h2>
            <p className="section-subtitle">Nuestra metodología de trabajo equilibra la eficiencia operativa con la calidez y la integridad pericial.</p>
          </div>

          <div className="pillars-grid">
            {pillars.map((item, idx) => (
              <div className="pillar-card" key={idx}>
                <div className="pillar-icon-wrap">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h3 className="pillar-title">{item.title}</h3>
                <p className="pillar-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="section process-section" id="proceso">
        <div className="container">
          <div className="process-grid">
            <div className="process-heading">
              <span className="section-kicker">Metodología Comprobada</span>
              <h2 className="section-title">Del primer reporte a una conclusión bien sustentada.</h2>
              <p className="section-subtitle">
                Protocolos estandarizados que aseguran un flujo de información continuo, documentación fotográfica exhaustiva y certidumbre jurídica en cada expediente.
              </p>
              <a href="#alianza" className="btn-cta btn-yellow">
                <span>Proponer esquema de colaboración</span>
                <span className="btn-icon-circle"><i className="fa-solid fa-chevron-right"></i></span>
              </a>
            </div>

            <ol className="process-list">
              {processes.map((step) => (
                <li className="process-item" key={step.num}>
                  <span className="process-number">{step.num}</span>
                  <div className="process-info">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Cobertura */}
      <section className="section coverage-section" id="cobertura">
        <div className="container">
          <div className="coverage-grid">
            <div className="coverage-head">
              <span className="section-kicker">Presencia Operativa</span>
              <h2 className="section-title">Cercanía y respuesta <em>donde más se necesita.</em></h2>
              <p className="section-subtitle" style={{ marginBottom: '24px' }}>
                Contamos con base operativa estratégica y una red de ajustadores periciales preparados para responder con máxima prontitud.
              </p>
            </div>

            <div className="region-cards-container">
              {regions.map((reg) => (
                <article className="region-card" key={reg.zone}>
                  <span className="region-num">{reg.zone}</span>
                  <h3 className="region-title"><i className="fa-solid fa-location-dot"></i> {reg.title}</h3>
                  <p className="region-desc">{reg.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Socios */}
      <section className="section partners-section" id="socios">
        <div className="container">
          <span className="section-kicker">Experiencia Compartida</span>
          <h2 className="section-title">Relaciones sólidas construidas sobre <em>resultados.</em></h2>
          <div className="partners-list-pill">
            {partners.map((p, i) => (
              <div className="partner-tag" key={i}>
                <i className={`fa-solid ${p.icon}`}></i> {p.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección B2B: Alianzas y Soluciones para Socios */}
      <section className="section partners-form-section" id="alianza">
        <div className="container">
          <div className="partners-form-grid">
            <div className="partner-value-card">
              <h2 className="partner-value-title">Soluciones Operativas en Campo a tu Medida</h2>
              <p className="partner-value-desc">
                Nos integramos como el brazo pericial y operativo de tu compañía o despacho en la región, garantizando altos estándares técnicos, cumplimiento de SLAs y protección de tu marca.
              </p>
              <div className="solution-item">
                <div className="solution-icon"><i className="fa-solid fa-handshake"></i></div>
                <div className="solution-text">
                  <strong>Para Aseguradoras y Despachos Nacionales</strong>
                  <span>Atención pericial local y foránea, desahogo de siniestros y reducción de costos operativos en zona centro y occidente.</span>
                </div>
              </div>
              <div className="solution-item">
                <div className="solution-icon"><i className="fa-solid fa-truck-moving"></i></div>
                <div className="solution-text">
                  <strong>Para Empresas de Transporte y Flotillas</strong>
                  <span>Acompañamiento especializado en colisiones, siniestros de carga y negociación en sitio ante autoridades.</span>
                </div>
              </div>
              <div className="solution-item">
                <div className="solution-icon"><i className="fa-solid fa-file-shield"></i></div>
                <div className="solution-text">
                  <strong>Investigación Técnica y Cuadernillos Digitales</strong>
                  <span>Dictámenes con sustento pericial, levantamiento fotográfico y entrega de expedientes debidamente fundamentados.</span>
                </div>
              </div>
              <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <p style={{ fontSize: '13.5px', color: 'var(--amarillo-darey)', fontWeight: 700, marginBottom: '6px' }}>
                  DAREY AJUSTADORES PROFESIONALES S.C.
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                  Conectando experiencia, precisión y confianza para impulsar tu operación.
                </p>
              </div>
            </div>

            <div className="partner-form-card">
              <h3 className="partner-form-title">Conectar como Nuevo Socio Comercial</h3>
              <p className="partner-form-subtitle">Completa este breve cuestionario para conocer tu organización y estructurar una propuesta operativa adaptada a tus necesidades en campo.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="nombreContacto">Nombre y Cargo *</label>
                    <input
                      type="text"
                      id="nombreContacto"
                      className="form-input"
                      placeholder="Ej. Lic. Carlos Méndez / Gerente de Siniestros"
                      required
                      value={formData.nombreContacto}
                      onChange={(e) => setFormData({ ...formData, nombreContacto: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="empresa">Empresa / Institución *</label>
                    <input
                      type="text"
                      id="empresa"
                      className="form-input"
                      placeholder="Ej. Aseguradora / Despacho / Flotilla"
                      required
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="tipoOrganizacion">Tipo de Organización *</label>
                    <select
                      id="tipoOrganizacion"
                      className="form-select"
                      required
                      value={formData.tipoOrganizacion}
                      onChange={(e) => setFormData({ ...formData, tipoOrganizacion: e.target.value })}
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Compañía Aseguradora">Compañía Aseguradora</option>
                      <option value="Despacho Pericial / Firma de Ajuste">Despacho Pericial / Firma de Ajuste</option>
                      <option value="Empresa de Transporte / Logística">Empresa de Transporte / Logística</option>
                      <option value="Broker / Correduría de Seguros">Broker / Correduría de Seguros</option>
                      <option value="Institución Financiera / Corporativo">Institución Financiera / Corporativo</option>
                      <option value="Otra Empresa">Otra Empresa</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="telefono">Teléfono / WhatsApp Directo *</label>
                    <input
                      type="tel"
                      id="telefono"
                      className="form-input"
                      placeholder="Ej. 444 123 4567"
                      required
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="correo">Correo Corporativo *</label>
                    <input
                      type="email"
                      id="correo"
                      className="form-input"
                      placeholder="Ej. contacto@empresa.com"
                      required
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="zonaInteres">Zona de Interés *</label>
                    <select
                      id="zonaInteres"
                      className="form-select"
                      value={formData.zonaInteres}
                      onChange={(e) => setFormData({ ...formData, zonaInteres: e.target.value })}
                    >
                      <option value="San Luis Potosí y Colindancias">San Luis Potosí y Colindancias</option>
                      <option value="Aguascalientes y Región">Aguascalientes y Región</option>
                      <option value="Baja California Sur">Baja California Sur</option>
                      <option value="Cobertura Regional / Occidente">Cobertura Regional / Occidente</option>
                      <option value="Red Nacional Extendida">Red Nacional Extendida</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="solucionRequerida">Solución o Necesidad en Campo</label>
                  <select
                    id="solucionRequerida"
                    className="form-select"
                    value={formData.solucionRequerida}
                    onChange={(e) => setFormData({ ...formData, solucionRequerida: e.target.value })}
                  >
                    <option value="Ajuste de Siniestros en Sitio y Cabina">Ajuste de Siniestros en Sitio y Cabina</option>
                    <option value="Investigación Pericial y Prevención de Fraude">Investigación Pericial y Prevención de Fraude</option>
                    <option value="Soporte y Desborde Operativo Foráneo">Soporte y Desborde Operativo Foráneo</option>
                    <option value="Atención Integral a Flotillas y Transporte Pesado">Atención Integral a Flotillas y Transporte Pesado</option>
                    <option value="Integración Documental y Cuadernillos Periciales">Integración Documental y Cuadernillos Periciales</option>
                    <option value="Alianza Estratégica Integral Multirramo">Alianza Estratégica Integral Multirramo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="mensaje">Requerimientos Específicos (Opcional)</label>
                  <textarea
                    id="mensaje"
                    className="form-textarea"
                    placeholder="Indícanos volumen estimado de siniestros, requerimientos de cobertura o puntos clave de tu operación..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-send-partner">
                  <span>Enviar propuesta de colaboración por WhatsApp</span>
                  <span className="btn-partner-icon"><i className="fa-solid fa-arrow-right"></i></span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/darey-logo-dark.png" alt="DAREY Ajustadores Profesionales S.C." />
              <p>
                Soluciones profesionales en ajuste de siniestros. Experiencia, precisión técnica y trato humano protegiendo la imagen de nuestros socios comerciales.
              </p>
              <div className="social-links">
                <a href="#" className="social-btn" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" className="social-btn" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" className="social-btn" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
              </div>
            </div>

            <div>
              <h4 className="footer-title">Enlaces Rápidos</h4>
              <ul className="footer-links">
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#nosotros">Quiénes Somos</a></li>
                <li><a href="#valores">Pilares y Compromisos</a></li>
                <li><a href="#proceso">Proceso Operativo</a></li>
                <li><a href="#cobertura">Cobertura Regional</a></li>
                <li><a href="#socios">Socios Comerciales</a></li>
                <li><a href="#alianza">Alianzas para Socios</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-title">DAREY S.C.</h4>
              <div className="footer-contact-item">
                <i className="fa-solid fa-shield-halved"></i>
                <div>
                  <strong>DAREY Ajustadores Profesionales S.C.</strong>
                  <span>Soluciones en campo para el sector asegurador</span>
                </div>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <strong>San Luis Potosí, S.L.P.</strong>
                  <span>Base central de coordinación regional</span>
                </div>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-envelope"></i>
                <div>
                  <strong>contacto@darey.com.mx</strong>
                  <span>Atención a aseguradoras y socios</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h4 className="footer-title">Lema</h4>
                <p style={{ color: 'var(--cian)', fontWeight: 700, fontSize: '14px' }}>Profesionalismo en movimiento.</p>
              </div>
              <a href="#inicio" className="back-to-top" aria-label="Volver arriba">
                <i className="fa-solid fa-arrow-up"></i>
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 DAREY Ajustadores Profesionales S.C. Todos los derechos reservados.</p>
            <p>Alianzas Estratégicas y Soluciones en Campo · San Luis Potosí</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

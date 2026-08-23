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
    nombre: '',
    telefono: '',
    aseguradora: '',
    ubicacion: '',
    tipoSiniestro: 'Colisión / Choque Vehicular',
    detalles: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = '524440000000';
    let msg = '*🚨 SOLICITUD DE AJUSTADOR - DAREY S.C. 🚨*\n';
    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    msg += `👤 *Reportante:* ${formData.nombre}\n`;
    msg += `📞 *Teléfono:* ${formData.telefono}\n`;
    msg += `🏢 *Aseguradora/Empresa:* ${formData.aseguradora}\n`;
    msg += `📍 *Ubicación del Siniestro:* ${formData.ubicacion}\n`;
    msg += `🚗 *Tipo de Siniestro:* ${formData.tipoSiniestro}\n`;
    if (formData.detalles) {
      msg += `📝 *Detalles/Folio:* ${formData.detalles}\n`;
    }
    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    msg += '_Solicitud enviada desde portal web DAREY_';

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`, '_blank');
  };

  return (
    <main>
      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/524440000000?text=Hola%20DAREY,%20requiero%20solicitar%20un%20ajustador"
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacto WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
        <span>Atención Inmediata</span>
      </a>

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
            <a href="#contacto" className="btn-cta">
              <span>Solicitar ajustador</span>
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
              <a href="#contacto" className="btn-cta btn-yellow">
                <span>Solicitar atención inmediata</span>
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
                <div className="stat-label">Atención y coordinación inmediata en sitio</div>
              </div>
            </div>
            <div className="hero-card-footer">
              <img src="/darey-icon.jpg" alt="Icono DAREY" />
              <div className="hero-card-footer-text">
                <strong>Siniestros & Ajustes Especializados</strong>
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
              <a href="#contacto" className="btn-cta btn-yellow">
                <span>Solicitar servicio pericial</span>
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

      {/* Captura de Datos & WhatsApp */}
      <section className="section contact-form-section" id="contacto">
        <div className="container">
          <div className="contact-container-grid">
            <div className="contact-info-card">
              <h2 className="contact-info-title">Atención Inmediata a Siniestros</h2>
              <p className="contact-info-desc">
                Coordina la asignación de un ajustador pericial en tiempo récord. Completa los datos del siniestro para generar un folio y reporte directo por WhatsApp.
              </p>
              <div className="contact-item-row">
                <div className="contact-item-icon"><i className="fa-solid fa-clock"></i></div>
                <div className="contact-item-text">
                  <strong>Disponibilidad Continua</strong>
                  <span>Servicio 24 horas · 365 días del año</span>
                </div>
              </div>
              <div className="contact-item-row">
                <div className="contact-item-icon"><i className="fa-solid fa-location-dot"></i></div>
                <div className="contact-item-text">
                  <strong>Base Operativa</strong>
                  <span>San Luis Potosí, SLP (Atención regional y foránea)</span>
                </div>
              </div>
              <div className="contact-item-row">
                <div className="contact-item-icon"><i className="fa-solid fa-envelope"></i></div>
                <div className="contact-item-text">
                  <strong>Correo Corporativo</strong>
                  <span>contacto@darey.com.mx</span>
                </div>
              </div>
              <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <p style={{ fontSize: '13.5px', color: 'var(--amarillo-darey)', fontWeight: 700, marginBottom: '6px' }}>
                  DAREY AJUSTADORES PROFESIONALES S.C.
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                  Profesionalismo en movimiento.
                </p>
              </div>
            </div>

            <div className="form-wrapper-card">
              <h3 className="form-wrapper-title">Solicitar Ajustador / Reporte</h3>
              <p className="form-wrapper-subtitle">Completa los campos para generar automáticamente tu mensaje de WhatsApp estructurado.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="nombre">Nombre / Reportante *</label>
                    <input
                      type="text"
                      id="nombre"
                      className="form-input"
                      placeholder="Ej. Juan Pérez / Cabina"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="telefono">Teléfono de Contacto *</label>
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
                    <label className="form-label" htmlFor="aseguradora">Aseguradora / Empresa *</label>
                    <select
                      id="aseguradora"
                      className="form-select"
                      required
                      value={formData.aseguradora}
                      onChange={(e) => setFormData({ ...formData, aseguradora: e.target.value })}
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Seguros Afirme">Seguros Afirme</option>
                      <option value="Seguros El Águila">Seguros El Águila</option>
                      <option value="General de Seguros">General de Seguros</option>
                      <option value="Más Soluciones">Más Soluciones</option>
                      <option value="Transporte Urbano / Colectivo">Transporte Urbano / Colectivo</option>
                      <option value="Grupo Zeus">Grupo Zeus</option>
                      <option value="Particular / Otra Aseguradora">Particular / Otra Aseguradora</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="ubicacion">Ubicación / Ciudad *</label>
                    <input
                      type="text"
                      id="ubicacion"
                      className="form-input"
                      placeholder="Ej. San Luis Potosí (Carr. 57)"
                      required
                      value={formData.ubicacion}
                      onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tipoSiniestro">Tipo de Siniestro</label>
                  <select
                    id="tipoSiniestro"
                    className="form-select"
                    value={formData.tipoSiniestro}
                    onChange={(e) => setFormData({ ...formData, tipoSiniestro: e.target.value })}
                  >
                    <option value="Colisión / Choque Vehicular">Colisión / Choque Vehicular</option>
                    <option value="Transporte Pesado / Carga">Transporte Pesado / Carga</option>
                    <option value="Transporte de Pasajeros">Transporte de Pasajeros</option>
                    <option value="Daños a Terceros / Bienes">Daños a Terceros / Bienes</option>
                    <option value="Robo / Asistencia Legal">Robo / Asistencia Legal</option>
                    <option value="Investigación Pericial Especializada">Investigación Pericial Especializada</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="detalles">Detalles / Folio de Siniestro (Opcional)</label>
                  <textarea
                    id="detalles"
                    className="form-textarea"
                    placeholder="Describe brevemente la situación, folio de reporte..."
                    value={formData.detalles}
                    onChange={(e) => setFormData({ ...formData, detalles: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-send-whatsapp">
                  <i className="fa-brands fa-whatsapp"></i>
                  <span>Enviar reporte a WhatsApp DAREY</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/darey-logo-dark.png" alt="DAREY Ajustadores Profesionales S.C." />
              <p>
                Soluciones profesionales en ajuste de siniestros. Experiencia, precisión técnica y trato humano protegiendo la imagen de nuestros socios.
              </p>
              <div className="social-links">
                <a href="#" className="social-btn" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" className="social-btn" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" className="social-btn" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="https://wa.me/524440000000" className="social-btn" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
              </div>
            </div>

            <div>
              <h4 className="footer-title">Enlaces Rápidos</h4>
              <ul className="footer-links">
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#nosotros">Quiénes Somos</a></li>
                <li><a href="#valores">Pilares y Compromisos</a></li>
                <li><a href="#proceso">Proceso de Ajuste</a></li>
                <li><a href="#cobertura">Cobertura Regional</a></li>
                <li><a href="#socios">Socios Comerciales</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-title">DAREY S.C.</h4>
              <div className="footer-contact-item">
                <i className="fa-solid fa-shield-halved"></i>
                <div>
                  <strong>DAREY Ajustadores Profesionales S.C.</strong>
                  <span>Ajuste de siniestros e investigación pericial</span>
                </div>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <strong>San Luis Potosí, S.L.P.</strong>
                  <span>Servicio local y foráneo en la región</span>
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
            <p>Identidad Gráfica Oficial · Profesionalismo en movimiento</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

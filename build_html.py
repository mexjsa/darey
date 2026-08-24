import os

with open('darey/logo_b64.txt') as f:
    b64_light = f.read().strip()
with open('darey/logo_dark_b64.txt') as f:
    b64_dark = f.read().strip()
with open('darey/icon_b64.txt') as f:
    b64_icon = f.read().strip()

template = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DAREY Ajustadores Profesionales S.C. | Soluciones en Campo para Socios Comerciales</title>
  <meta name="description" content="DAREY Ajustadores Profesionales S.C. - Alianzas operativas y soluciones en campo para compañías aseguradoras, despachos periciales y empresas de transporte. San Luis Potosí, Aguascalientes, BCS y Red Nacional.">
  
  <!-- Favicon -->
  <link rel="icon" type="image/jpeg" href="data:image/jpeg;base64,__ICON_B64__">
  <link rel="apple-touch-icon" href="data:image/jpeg;base64,__ICON_B64__">
  
  <!-- Google Fonts: Montserrat -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap" rel="stylesheet">
  
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <style>
    /* =========================================================
       DAREY BRAND IDENTITY GUIDELINES SYSTEM
       ========================================================= */
    :root {
      /* Official Color Palette */
      --azul-darey: #0089A9;      /* Color principal de la marca */
      --azul-profundo: #005A82;   /* Fondos, encabezados y elementos sólidos */
      --azul-electrico: #0755E8;  /* Acentos digitales y estados activos */
      --cian: #00B2CF;            /* Highlights, gráficos y elementos tecnológicos */
      --amarillo-darey: #F8C400;  /* Acento principal, llamadas a la acción (CTAs) */
      --naranja: #F5A000;         /* Complemento amarillo, señalización */
      --carbon: #202124;          /* Texto principal y contenido */
      --blanco: #FFFFFF;          /* Fondos y contraste */
      
      /* Derived Neutrals */
      --bg-light: #F4F9FB;
      --bg-subtle: #EBF3F5;
      --text-muted: #53626C;
      --border-color: #D3E2E6;
      --card-shadow: 0 12px 30px -8px rgba(0, 90, 130, 0.12);
      --card-hover: 0 20px 40px -10px rgba(0, 137, 169, 0.22);
      
      /* Gradients */
      --grad-darey-cian: linear-gradient(135deg, #0089A9 0%, #00B2CF 100%);
      --grad-profundo-electrico: linear-gradient(135deg, #005A82 0%, #0755E8 100%);
      --grad-amarillo-naranja: linear-gradient(135deg, #F8C400 0%, #F5A000 100%);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      font-size: 16px;
    }

    body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--carbon);
      background-color: var(--blanco);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* Container */
    .container {
      width: 100%;
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Navigation Bar */
    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      transition: all 0.35s ease;
      padding: 14px 0;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 20px rgba(0, 90, 130, 0.08);
      border-bottom: 1px solid rgba(0, 178, 207, 0.15);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .brand-logo img {
      height: 52px;
      width: auto;
      max-width: 250px;
      object-fit: contain;
      transition: transform 0.3s ease;
      display: block;
    }

    .brand-logo:hover img {
      transform: scale(1.02);
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 28px;
      list-style: none;
    }

    .nav-link {
      text-decoration: none;
      color: var(--azul-profundo);
      font-weight: 600;
      font-size: 15px;
      transition: color 0.25s ease;
      position: relative;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0%;
      height: 2px;
      background: var(--azul-darey);
      transition: width 0.3s ease;
      border-radius: 2px;
    }

    .nav-link:hover {
      color: var(--azul-darey);
    }

    .nav-link:hover::after {
      width: 100%;
    }

    /* Official Buttons */
    .btn-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 12px 24px;
      background: var(--azul-darey);
      color: var(--blanco);
      font-weight: 700;
      font-size: 14.5px;
      border-radius: 50px;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 14px rgba(0, 137, 169, 0.3);
      border: none;
      cursor: pointer;
    }

    .btn-cta .btn-icon-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: var(--amarillo-darey);
      color: var(--carbon);
      border-radius: 50%;
      font-size: 11px;
      transition: transform 0.3s ease;
    }

    .btn-cta:hover {
      background: var(--azul-profundo);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 90, 130, 0.35);
    }

    .btn-cta:hover .btn-icon-circle {
      transform: translateX(3px);
    }

    .btn-yellow {
      background: var(--amarillo-darey);
      color: var(--carbon);
      box-shadow: 0 4px 14px rgba(248, 196, 0, 0.4);
    }

    .btn-yellow .btn-icon-circle {
      background: var(--azul-profundo);
      color: var(--blanco);
    }

    .btn-yellow:hover {
      background: var(--naranja);
      color: var(--carbon);
      box-shadow: 0 6px 20px rgba(245, 160, 0, 0.45);
    }

    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      background: transparent;
      color: var(--blanco);
      border: 2px solid rgba(255, 255, 255, 0.7);
      border-radius: 50px;
      font-weight: 700;
      font-size: 14.5px;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: var(--blanco);
      transform: translateY(-2px);
    }

    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 24px;
      color: var(--azul-profundo);
      cursor: pointer;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      min-height: 95vh;
      display: flex;
      align-items: center;
      padding: 130px 0 80px;
      background-color: var(--azul-profundo);
      background-image: url('./san-luis.jpg');
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      color: var(--blanco);
      overflow: hidden;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(105deg, rgba(0, 35, 55, 0.94) 0%, rgba(0, 90, 130, 0.85) 55%, rgba(0, 137, 169, 0.4) 100%);
      z-index: 1;
    }

    .hero-container {
      position: relative;
      z-index: 3;
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 48px;
      align-items: center;
    }

    .badge-tagline {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 18px;
      background: rgba(0, 178, 207, 0.2);
      border: 1px solid rgba(0, 178, 207, 0.4);
      border-radius: 50px;
      color: var(--amarillo-darey);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 24px;
      backdrop-filter: blur(8px);
    }

    .hero-title {
      font-size: clamp(38px, 5.5vw, 62px);
      font-weight: 900;
      line-height: 1.08;
      margin-bottom: 24px;
      letter-spacing: -0.03em;
    }

    .hero-title .highlight-cian {
      color: var(--cian);
      background: linear-gradient(120deg, #00B2CF, #F8C400);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-description {
      font-size: clamp(16px, 1.35vw, 19px);
      line-height: 1.65;
      color: rgba(255, 255, 255, 0.92);
      margin-bottom: 36px;
      font-weight: 400;
      max-width: 620px;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }

    /* Hero Floating Experience Card */
    .hero-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 36px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    }

    .hero-stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .stat-box {
      border-left: 4px solid var(--amarillo-darey);
      padding-left: 16px;
    }

    .stat-number {
      font-size: 42px;
      font-weight: 900;
      color: var(--amarillo-darey);
      line-height: 1;
      margin-bottom: 6px;
    }

    .stat-label {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.4;
    }

    .hero-card-footer {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .hero-card-footer img {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      object-fit: cover;
      display: block;
    }

    .hero-card-footer-text {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.8);
    }

    .hero-card-footer-text strong {
      display: block;
      color: var(--blanco);
      font-size: 14px;
    }

    /* Section Headers */
    .section {
      padding: 100px 0;
    }

    .section-kicker {
      display: inline-block;
      color: var(--azul-darey);
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .section-title {
      font-size: clamp(30px, 3.5vw, 44px);
      font-weight: 800;
      color: var(--azul-profundo);
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 20px;
    }

    .section-title em {
      font-style: normal;
      color: var(--azul-darey);
      background: var(--grad-darey-cian);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .section-subtitle {
      font-size: 17px;
      color: var(--text-muted);
      max-width: 680px;
      line-height: 1.7;
    }

    /* About Section */
    .about-section {
      background: var(--blanco);
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 60px;
      align-items: center;
    }

    .about-badge-card {
      background: var(--bg-light);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 36px;
      position: relative;
      overflow: hidden;
    }

    .about-badge-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 100%;
      background: var(--grad-darey-cian);
    }

    .quote-box {
      font-size: 19px;
      font-weight: 600;
      color: var(--azul-profundo);
      line-height: 1.6;
      margin-bottom: 20px;
      font-style: italic;
    }

    .quote-author {
      font-size: 14px;
      font-weight: 700;
      color: var(--azul-darey);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    /* Pillars Section */
    .pillars-section {
      background: var(--bg-light);
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
    }

    .pillars-header {
      text-align: center;
      max-width: 780px;
      margin: 0 auto 60px;
    }

    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .pillar-card {
      background: var(--blanco);
      border-radius: 16px;
      padding: 36px 26px;
      border: 1px solid var(--border-color);
      transition: all 0.35s ease;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .pillar-card::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: var(--grad-darey-cian);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .pillar-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--card-hover);
      border-color: var(--cian);
    }

    .pillar-card:hover::after {
      opacity: 1;
    }

    .pillar-icon-wrap {
      width: 60px;
      height: 60px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(0, 137, 169, 0.12) 0%, rgba(0, 178, 207, 0.2) 100%);
      color: var(--azul-darey);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      margin-bottom: 24px;
      transition: all 0.3s ease;
    }

    .pillar-card:hover .pillar-icon-wrap {
      background: var(--grad-darey-cian);
      color: var(--blanco);
      transform: scale(1.08);
    }

    .pillar-title {
      font-size: 20px;
      font-weight: 800;
      color: var(--azul-profundo);
      margin-bottom: 12px;
    }

    .pillar-desc {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.65;
    }

    /* Process Section */
    .process-section {
      background: var(--azul-profundo);
      color: var(--blanco);
      position: relative;
      overflow: hidden;
    }

    .process-grid {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 64px;
      align-items: start;
    }

    .process-heading .section-kicker {
      color: var(--cian);
    }

    .process-heading .section-title {
      color: var(--blanco);
    }

    .process-heading .section-subtitle {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 36px;
    }

    .process-list {
      list-style: none;
    }

    .process-item {
      display: grid;
      grid-template-columns: 56px 1fr;
      gap: 24px;
      padding: 26px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.16);
    }

    .process-item:last-child {
      border-bottom: 1px solid rgba(255, 255, 255, 0.16);
    }

    .process-number {
      font-size: 20px;
      font-weight: 900;
      color: var(--amarillo-darey);
      display: flex;
      align-items: flex-start;
      padding-top: 2px;
    }

    .process-info h3 {
      font-size: 20px;
      font-weight: 700;
      color: var(--blanco);
      margin-bottom: 6px;
    }

    .process-info p {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
    }

    /* Coverage Section */
    .coverage-section {
      background: var(--bg-light);
    }

    .coverage-grid {
      display: grid;
      grid-template-columns: 0.85fr 1.15fr;
      gap: 60px;
      align-items: center;
    }

    .region-cards-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .region-card {
      background: var(--blanco);
      padding: 26px;
      border-radius: 16px;
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 15px rgba(0, 90, 130, 0.04);
      transition: all 0.3s ease;
    }

    .region-card:hover {
      border-color: var(--azul-darey);
      transform: translateY(-4px);
      box-shadow: var(--card-shadow);
    }

    .region-num {
      display: inline-block;
      font-size: 12px;
      font-weight: 800;
      color: var(--azul-darey);
      letter-spacing: 0.1em;
      margin-bottom: 8px;
    }

    .region-title {
      font-size: 18px;
      font-weight: 800;
      color: var(--azul-profundo);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .region-title i {
      color: var(--azul-electrico);
      font-size: 15px;
    }

    .region-desc {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.55;
    }

    /* Partners */
    .partners-section {
      background: var(--blanco);
      text-align: center;
    }

    .partners-section .section-title {
      max-width: 800px;
      margin: 0 auto 20px;
    }

    .partners-list-pill {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 14px;
      max-width: 980px;
      margin: 40px auto 0;
    }

    .partner-tag {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      padding: 12px 24px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 700;
      color: var(--azul-profundo);
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
    }

    .partner-tag i {
      color: var(--azul-darey);
    }

    .partner-tag:hover {
      background: var(--azul-darey);
      color: var(--blanco);
      border-color: var(--azul-darey);
      transform: translateY(-2px);
    }

    .partner-tag:hover i {
      color: var(--amarillo-darey);
    }

    /* =========================================================
       NUEVA SECCIÓN B2B: ALIANZAS Y SOLUCIONES PARA SOCIOS
       ========================================================= */
    .partners-form-section {
      background: linear-gradient(180deg, #F4F9FB 0%, #E6EFF2 100%);
      position: relative;
    }

    .partners-form-grid {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 48px;
      align-items: start;
    }

    .partner-value-card {
      background: var(--azul-profundo);
      color: var(--blanco);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 16px 36px rgba(0, 90, 130, 0.18);
      position: relative;
      overflow: hidden;
    }

    .partner-value-card::before {
      content: '';
      position: absolute;
      top: -30%;
      right: -30%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(0, 178, 207, 0.2) 0%, transparent 70%);
      pointer-events: none;
    }

    .partner-value-title {
      font-size: 26px;
      font-weight: 800;
      margin-bottom: 14px;
      color: var(--blanco);
      line-height: 1.2;
    }

    .partner-value-desc {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.88);
      line-height: 1.65;
      margin-bottom: 30px;
    }

    .solution-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 22px;
    }

    .solution-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--amarillo-darey);
      font-size: 18px;
      flex-shrink: 0;
    }

    .solution-text strong {
      display: block;
      font-size: 15px;
      color: var(--blanco);
      margin-bottom: 3px;
    }

    .solution-text span {
      font-size: 13.5px;
      color: rgba(255, 255, 255, 0.72);
      line-height: 1.5;
    }

    /* Enlace discreto para el Integrador Documental */
    .integrador-link-subtle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      background: rgba(255, 255, 255, 0.08);
      padding: 5px 14px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      transition: all 0.25s ease;
    }

    .integrador-link-subtle:hover {
      color: var(--amarillo-darey);
      background: rgba(255, 255, 255, 0.15);
      border-color: var(--amarillo-darey);
      transform: translateX(2px);
    }

    .partner-form-card {
      background: var(--blanco);
      border-radius: 20px;
      padding: 44px;
      box-shadow: 0 16px 40px rgba(0, 90, 130, 0.08);
      border: 1px solid var(--border-color);
    }

    .partner-form-title {
      font-size: 24px;
      font-weight: 800;
      color: var(--azul-profundo);
      margin-bottom: 6px;
    }

    .partner-form-subtitle {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 28px;
      line-height: 1.5;
    }

    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: var(--azul-profundo);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 13px 16px;
      border: 1.5px solid var(--border-color);
      border-radius: 10px;
      font-family: inherit;
      font-size: 14.5px;
      color: var(--carbon);
      background-color: #FAFCFD;
      transition: all 0.25s ease;
      outline: none;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: var(--azul-darey);
      background-color: var(--blanco);
      box-shadow: 0 0 0 4px rgba(0, 137, 169, 0.12);
    }

    .form-textarea {
      resize: vertical;
      min-height: 90px;
    }

    .btn-send-partner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      padding: 16px 28px;
      background: var(--azul-darey);
      color: white;
      font-family: inherit;
      font-weight: 800;
      font-size: 15.5px;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0, 137, 169, 0.35);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-send-partner:hover {
      background: var(--azul-profundo);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 90, 130, 0.45);
    }

    .btn-send-partner .btn-partner-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: var(--amarillo-darey);
      color: var(--carbon);
      border-radius: 50%;
      font-size: 13px;
    }

    .form-note {
      text-align: center;
      margin-top: 14px;
      font-size: 12.5px;
      color: var(--text-muted);
    }

    /* Footer */
    footer {
      background: #001A26;
      color: var(--blanco);
      padding: 80px 0 40px;
      position: relative;
      border-top: 4px solid var(--azul-darey);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1.2fr 0.6fr;
      gap: 48px;
      margin-bottom: 60px;
    }

    .footer-brand img {
      height: 52px;
      width: auto;
      max-width: 250px;
      object-fit: contain;
      margin-bottom: 20px;
      display: block;
    }

    .footer-brand p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.65);
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .social-links {
      display: flex;
      gap: 12px;
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      color: var(--blanco);
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 16px;
    }

    .social-btn:hover {
      background: var(--azul-darey);
      color: var(--blanco);
      border-color: var(--azul-darey);
      transform: translateY(-3px);
    }

    .footer-title {
      font-size: 16px;
      font-weight: 800;
      color: var(--amarillo-darey);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
    }

    .footer-contact-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 16px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.75);
    }

    .footer-contact-item i {
      color: var(--cian);
      font-size: 16px;
      margin-top: 4px;
    }

    .footer-contact-item strong {
      display: block;
      color: var(--blanco);
      font-size: 15px;
    }

    .footer-links {
      list-style: none;
    }

    .footer-links li {
      margin-bottom: 12px;
    }

    .footer-links a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 14px;
      transition: color 0.25s ease;
    }

    .footer-links a:hover {
      color: var(--amarillo-darey);
    }

    .footer-bottom {
      padding-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      flex-wrap: wrap;
      gap: 16px;
    }

    .back-to-top {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      color: var(--blanco);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .back-to-top:hover {
      background: var(--amarillo-darey);
      color: var(--carbon);
      transform: translateY(-4px);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero-container, .about-grid, .process-grid, .coverage-grid, .partners-form-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      .pillars-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .footer-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 768px) {
      .site-header {
        padding: 14px 0;
      }
      .nav-menu {
        position: fixed;
        top: 76px;
        left: 0;
        width: 100%;
        background: var(--blanco);
        flex-direction: column;
        padding: 30px 24px;
        gap: 20px;
        box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        display: none;
      }
      .nav-menu.active {
        display: flex;
      }
      .mobile-menu-toggle {
        display: block;
      }
      .pillars-grid, .region-cards-container, .form-grid-2 {
        grid-template-columns: 1fr;
      }
      .hero-stats-grid {
        grid-template-columns: 1fr;
      }
      .footer-grid {
        grid-template-columns: 1fr;
      }
      .partner-form-card {
        padding: 28px 20px;
      }
    }
  </style>
</head>
<body>

  <!-- Main Navigation Header -->
  <header class="site-header" id="site-header">
    <div class="container header-inner">
      <a href="#inicio" class="brand-logo" aria-label="DAREY Ajustadores Profesionales Inicio">
        <!-- Embedded crisp high resolution transparent logo for light background -->
        <img src="data:image/png;base64,__LOGO_LIGHT_B64__" alt="DAREY Ajustadores Profesionales S.C.">
      </a>
      
      <button class="mobile-menu-toggle" id="mobile-toggle" aria-label="Abrir menú">
        <i class="fa-solid fa-bars"></i>
      </button>

      <ul class="nav-menu" id="nav-menu">
        <li><a href="#inicio" class="nav-link">Inicio</a></li>
        <li><a href="#nosotros" class="nav-link">Nosotros</a></li>
        <li><a href="#valores" class="nav-link">Compromisos</a></li>
        <li><a href="#proceso" class="nav-link">Proceso</a></li>
        <li><a href="#cobertura" class="nav-link">Cobertura</a></li>
        <li><a href="#socios" class="nav-link">Socios</a></li>
        <li>
          <a href="#alianza" class="btn-cta">
            <span>Alianza Comercial</span>
            <span class="btn-icon-circle"><i class="fa-solid fa-chevron-right"></i></span>
          </a>
        </li>
      </ul>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section class="hero-section" id="inicio">
      <div class="hero-overlay"></div>
      
      <div class="container hero-container">
        <div class="hero-content">
          <div class="badge-tagline">
            <i class="fa-solid fa-shield-halved"></i> Profesionalismo en movimiento
          </div>
          
          <h1 class="hero-title">
            Respuesta oportuna.<br>
            <span class="highlight-cian">Atención humana.</span>
          </h1>
          
          <p class="hero-description">
            En DAREY conectamos experiencia, precisión y confianza para brindar soluciones profesionales en ajuste de siniestros, cuidando en todo momento la imagen de nuestros socios comerciales.
          </p>
          
          <div class="hero-actions">
            <a href="#alianza" class="btn-cta btn-yellow">
              <span>Conectar como socio comercial</span>
              <span class="btn-icon-circle"><i class="fa-solid fa-arrow-right"></i></span>
            </a>
            <a href="#nosotros" class="btn-ghost">
              <i class="fa-regular fa-compass"></i> Conocer DAREY
            </a>
          </div>
        </div>

        <!-- Floating Experience Card -->
        <div class="hero-card">
          <div class="hero-stats-grid">
            <div class="stat-box">
              <div class="stat-number">35+</div>
              <div class="stat-label">Años de experiencia combinada en el sector asegurador</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Atención y coordinación operativa en campo</div>
            </div>
          </div>
          
          <div class="hero-card-footer">
            <img src="data:image/jpeg;base64,__ICON_B64__" alt="Icono DAREY">
            <div class="hero-card-footer-text">
              <strong>Soluciones Periciales para Socios</strong>
              San Luis Potosí, Aguascalientes, BCS y Red Nacional
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quienes Somos / Identidad Section -->
    <section class="section about-section" id="nosotros">
      <div class="container">
        <div class="about-grid">
          <div>
            <span class="section-kicker">Nuestra Identidad</span>
            <h2 class="section-title">Experiencia que se traduce en <em>confianza y precisión.</em></h2>
            <p class="section-subtitle" style="margin-bottom: 24px;">
              DAREY es una empresa con sólida trayectoria en el mercado asegurador, respaldada por más de 35 años de experiencia ofreciendo soluciones técnicas y periciales de alto nivel.
            </p>
            <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
              Entendemos a profundidad las exigencias de las compañías aseguradoras y las sensibilidades del asegurado. Por ello, cada intervención combina rigurosidad técnica, investigación objetiva, comunicación transparente y un respeto irrestricto por la reputación institucional de nuestros socios.
            </p>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 10px; font-weight: 700; color: var(--azul-profundo);">
                <i class="fa-solid fa-circle-check" style="color: var(--azul-darey); font-size: 20px;"></i>
                Dictámenes sustentados
              </div>
              <div style="display: flex; align-items: center; gap: 10px; font-weight: 700; color: var(--azul-profundo);">
                <i class="fa-solid fa-circle-check" style="color: var(--azul-darey); font-size: 20px;"></i>
                Trato cercano y empático
              </div>
            </div>
          </div>

          <div class="about-badge-card">
            <p class="quote-box">
              "En DAREY conectamos experiencia, precisión y confianza para brindar soluciones profesionales en ajuste de siniestros."
            </p>
            <div class="quote-author">
              DAREY Ajustadores Profesionales S.C.
            </div>
            <div style="margin-top: 24px; display: flex; align-items: center; gap: 16px;">
              <img src="data:image/jpeg;base64,__ICON_B64__" alt="DAREY Identidad" style="width: 54px; height: 54px; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <div>
                <strong style="color: var(--azul-profundo); display: block; font-size: 15px;">Profesionalismo en movimiento</strong>
                <span style="font-size: 13px; color: var(--text-muted);">Estándar de calidad garantizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pilares Corporativos / Valores -->
    <section class="section pillars-section" id="valores">
      <div class="container">
        <div class="pillars-header">
          <span class="section-kicker">Pilares Estratégicos</span>
          <h2 class="section-title">Valores que guían cada <em>intervención</em></h2>
          <p class="section-subtitle">Nuestra metodología de trabajo equilibra la eficiencia operativa con la calidez y la integridad pericial.</p>
        </div>

        <div class="pillars-grid">
          <!-- 1. Experiencia -->
          <div class="pillar-card">
            <div class="pillar-icon-wrap">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <h3 class="pillar-title">Experiencia</h3>
            <p class="pillar-desc">
              Más de 35 años de trayectoria en el sector asegurador, garantizando criterio pericial certero y resolución efectiva de contingencias.
            </p>
          </div>

          <!-- 2. Confianza -->
          <div class="pillar-card">
            <div class="pillar-icon-wrap">
              <i class="fa-solid fa-user-check"></i>
            </div>
            <h3 class="pillar-title">Confianza</h3>
            <p class="pillar-desc">
              Transparencia e integridad en la recopilación de testimonios, inspección documental y dictámenes técnicos claros e imparciales.
            </p>
          </div>

          <!-- 3. Agilidad -->
          <div class="pillar-card">
            <div class="pillar-icon-wrap">
              <i class="fa-solid fa-gauge-high"></i>
            </div>
            <h3 class="pillar-title">Agilidad</h3>
            <p class="pillar-desc">
              Arribo oportuno en sitio reduciendo tiempos de espera, porque sabemos que cada minuto define la satisfacción del asegurado.
            </p>
          </div>

          <!-- 4. Compromiso -->
          <div class="pillar-card">
            <div class="pillar-icon-wrap">
              <i class="fa-solid fa-handshake"></i>
            </div>
            <h3 class="pillar-title">Compromiso</h3>
            <p class="pillar-desc">
              Acompañamiento humano integral y protección constante de la imagen y prestigio de las aseguradoras asociadas.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Proceso Operativo -->
    <section class="section process-section" id="proceso">
      <div class="container">
        <div class="process-grid">
          <div class="process-heading">
            <span class="section-kicker">Metodología Comprobada</span>
            <h2 class="section-title">Del primer reporte a una conclusión bien sustentada.</h2>
            <p class="section-subtitle">
              Protocolos estandarizados que aseguran un flujo de información continuo, documentación fotográfica exhaustiva y certidumbre jurídica en cada expediente.
            </p>
            <a href="#alianza" class="btn-cta btn-yellow">
              <span>Proponer esquema de colaboración</span>
              <span class="btn-icon-circle"><i class="fa-solid fa-chevron-right"></i></span>
            </a>
          </div>

          <ol class="process-list">
            <li class="process-item">
              <span class="process-number">01</span>
              <div class="process-info">
                <h3>Recepción y Contacto Inmediato</h3>
                <p>Recepción del folio, validación preliminar de póliza y cobertura, y llamada inmediata con el conductor o asegurado.</p>
              </div>
            </li>
            <li class="process-item">
              <span class="process-number">02</span>
              <div class="process-info">
                <h3>Atención y Presencia en Sitio</h3>
                <p>Arribo puntual al lugar del siniestro, identificación de vehículos involucrados y asesoría presencial ante autoridades y terceros.</p>
              </div>
            </li>
            <li class="process-item">
              <span class="process-number">03</span>
              <div class="process-info">
                <h3>Investigación y Evidencia Técnica</h3>
                <p>Levantamiento pericial, toma de declaraciones, registro fotográfico en alta resolución y análisis de dinámica del siniestro.</p>
              </div>
            </li>
            <li class="process-item">
              <span class="process-number">04</span>
              <div class="process-info">
                <h3>Entrega Documentada & Cuadernillo</h3>
                <p>Integración rigurosa del cuadernillo digital con dictamen de responsabilidad para la pronta liquidación de la aseguradora.</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Cobertura Regional -->
    <section class="section coverage-section" id="cobertura">
      <div class="container">
        <div class="coverage-grid">
          <div class="coverage-head">
            <span class="section-kicker">Presencia Operativa</span>
            <h2 class="section-title">Cercanía y respuesta <em>donde más se necesita.</em></h2>
            <p class="section-subtitle" style="margin-bottom: 24px;">
              Contamos con base operativa estratégica y una red de ajustadores periciales preparados para responder con máxima prontitud.
            </p>
            <div style="background: var(--blanco); border: 1px solid var(--border-color); border-radius: 14px; padding: 20px; display: flex; align-items: center; gap: 16px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(0, 137, 169, 0.1); display: flex; align-items: center; justify-content: center; color: var(--azul-darey); font-size: 20px;">
                <i class="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                <strong style="color: var(--azul-profundo); font-size: 15px; display: block;">Base Central: San Luis Potosí</strong>
                <span style="font-size: 13.5px; color: var(--text-muted);">Disponibilidad 24 horas los 365 días del año</span>
              </div>
            </div>
          </div>

          <div class="region-cards-container">
            <article class="region-card">
              <span class="region-num">ZONA 01</span>
              <h3 class="region-title"><i class="fa-solid fa-location-dot"></i> San Luis Potosí</h3>
              <p class="region-desc">Capital del estado, zona metropolitana, sus 58 municipios y colindancias carreteras estratégicas.</p>
            </article>

            <article class="region-card">
              <span class="region-num">ZONA 02</span>
              <h3 class="region-title"><i class="fa-solid fa-location-dot"></i> Aguascalientes</h3>
              <p class="region-desc">Cobertura integral en los 11 municipios y corredores limítrofes con Zacatecas y Jalisco.</p>
            </article>

            <article class="region-card">
              <span class="region-num">ZONA 03</span>
              <h3 class="region-title"><i class="fa-solid fa-location-dot"></i> Baja California Sur</h3>
              <p class="region-desc">Presencia activa en La Paz, Los Cabos, Todos Santos, Ciudad Constitución y Loreto.</p>
            </article>

            <article class="region-card">
              <span class="region-num">ZONA 04</span>
              <h3 class="region-title"><i class="fa-solid fa-globe"></i> Red Nacional Extendida</h3>
              <p class="region-desc">Presencia operativa en Colima, Tepic y coordinación interestatal a través de nuestra red de ajustadores.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners / Experiencia Compartida -->
    <section class="section partners-section" id="socios">
      <div class="container">
        <span class="section-kicker">Experiencia Compartida</span>
        <h2 class="section-title">Relaciones sólidas construidas sobre <em>resultados.</em></h2>
        <p class="section-subtitle" style="margin: 0 auto;">
          A lo largo de nuestra trayectoria, hemos colaborado activamente con destacadas instituciones, aseguradoras y organismos de transporte:
        </p>

        <div class="partners-list-pill">
          <div class="partner-tag"><i class="fa-solid fa-building-shield"></i> Seguros Afirme</div>
          <div class="partner-tag"><i class="fa-solid fa-handshake-angle"></i> Más Soluciones</div>
          <div class="partner-tag"><i class="fa-solid fa-bus-simple"></i> Movilidad Transporte Urbano & Colectivo</div>
          <div class="partner-tag"><i class="fa-solid fa-shield-halved"></i> Seguros El Águila</div>
          <div class="partner-tag"><i class="fa-solid fa-building-columns"></i> General de Seguros</div>
          <div class="partner-tag"><i class="fa-solid fa-award"></i> Grupo Zeus</div>
        </div>
      </div>
    </section>

    <!-- NUEVA SECCIÓN B2B: ALIANZAS Y SOLUCIONES EN CAMPO PARA SOCIOS -->
    <section class="section partners-form-section" id="alianza">
      <div class="container">
        <div class="partners-form-grid">
          
          <!-- Propuesta de Valor para Socios -->
          <div class="partner-value-card">
            <h2 class="partner-value-title">Soluciones Operativas en Campo a tu Medida</h2>
            <p class="partner-value-desc">
              Nos integramos como el brazo pericial y operativo de tu compañía o despacho en la región, garantizando altos estándares técnicos, cumplimiento de SLAs y protección de tu marca.
            </p>

            <div class="solution-item">
              <div class="solution-icon">
                <i class="fa-solid fa-handshake"></i>
              </div>
              <div class="solution-text">
                <strong>Para Aseguradoras y Despachos Nacionales</strong>
                <span>Atención pericial local y foránea, desahogo de siniestros y reducción de costos operativos en zona centro y occidente.</span>
              </div>
            </div>

            <div class="solution-item">
              <div class="solution-icon">
                <i class="fa-solid fa-truck-moving"></i>
              </div>
              <div class="solution-text">
                <strong>Para Empresas de Transporte y Flotillas</strong>
                <span>Acompañamiento especializado en colisiones, siniestros de carga y negociación en sitio ante autoridades.</span>
              </div>
            </div>

            <div class="solution-item">
              <div class="solution-icon">
                <i class="fa-solid fa-file-shield"></i>
              </div>
              <div class="solution-text">
                <strong>Investigación Técnica y Cuadernillos Digitales</strong>
                <span>Dictámenes con sustento pericial, levantamiento fotográfico y entrega de expedientes debidamente fundamentados.</span>
                <div>
                  <a href="./integrador/" class="integrador-link-subtle" title="Acceso al Integrador Documental para socios y empleados">
                    <i class="fa-solid fa-folder-open"></i> Acceso a Integrador Documental &rarr;
                  </a>
                </div>
              </div>
            </div>

            <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.15);">
              <p style="font-size: 13.5px; color: var(--amarillo-darey); font-weight: 700; margin-bottom: 6px;">
                DAREY AJUSTADORES PROFESIONALES S.C.
              </p>
              <p style="font-size: 13px; color: rgba(255,255,255,0.7);">
                Conectando experiencia, precisión y confianza para impulsar tu operación.
              </p>
            </div>
          </div>

          <!-- Cuestionario para Nuevos Socios -->
          <div class="partner-form-card">
            <h3 class="partner-form-title">Conectar como Nuevo Socio Comercial</h3>
            <p class="partner-form-subtitle">Completa este breve cuestionario para conocer tu organización y estructurar una propuesta operativa adaptada a tus necesidades en campo.</p>

            <form id="partnerForm" onsubmit="handlePartnerSubmit(event)">
              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label" for="nombreContacto">Nombre y Cargo *</label>
                  <input type="text" id="nombreContacto" class="form-input" placeholder="Ej. Lic. Carlos Méndez / Gerente de Siniestros" required>
                </div>

                <div class="form-group">
                  <label class="form-label" for="empresa">Empresa / Institución *</label>
                  <input type="text" id="empresa" class="form-input" placeholder="Ej. Aseguradora / Despacho / Flotilla" required>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label" for="tipoOrganizacion">Tipo de Organización *</label>
                  <select id="tipoOrganizacion" class="form-select" required>
                    <option value="">Selecciona una opción</option>
                    <option value="Compañía Aseguradora">Compañía Aseguradora</option>
                    <option value="Despacho Pericial / Firma de Ajuste">Despacho Pericial / Firma de Ajuste</option>
                    <option value="Empresa de Transporte / Logística">Empresa de Transporte / Logística</option>
                    <option value="Broker / Correduría de Seguros">Broker / Correduría de Seguros</option>
                    <option value="Institución Financiera / Corporativo">Institución Financiera / Corporativo</option>
                    <option value="Otra Empresa">Otra Empresa</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="telefono">Teléfono / WhatsApp Directo *</label>
                  <input type="tel" id="telefono" class="form-input" placeholder="Ej. 444 123 4567" required>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label" for="correo">Correo Corporativo *</label>
                  <input type="email" id="correo" class="form-input" placeholder="Ej. contacto@empresa.com" required>
                </div>

                <div class="form-group">
                  <label class="form-label" for="zonaInteres">Zona de Interés *</label>
                  <select id="zonaInteres" class="form-select" required>
                    <option value="San Luis Potosí y Colindancias">San Luis Potosí y Colindancias</option>
                    <option value="Aguascalientes y Región">Aguascalientes y Región</option>
                    <option value="Baja California Sur">Baja California Sur</option>
                    <option value="Cobertura Regional / Occidente">Cobertura Regional / Occidente</option>
                    <option value="Red Nacional Extendida">Red Nacional Extendida</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="solucionRequerida">Solución o Necesidad en Campo</label>
                <select id="solucionRequerida" class="form-select">
                  <option value="Ajuste de Siniestros en Sitio y Cabina">Ajuste de Siniestros en Sitio y Cabina</option>
                  <option value="Investigación Pericial y Prevención de Fraude">Investigación Pericial y Prevención de Fraude</option>
                  <option value="Soporte y Desborde Operativo Foráneo">Soporte y Desborde Operativo Foráneo</option>
                  <option value="Atención Integral a Flotillas y Transporte Pesado">Atención Integral a Flotillas y Transporte Pesado</option>
                  <option value="Integración Documental y Cuadernillos Periciales">Integración Documental y Cuadernillos Periciales</option>
                  <option value="Alianza Estratégica Integral Multirramo">Alianza Estratégica Integral Multirramo</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="mensaje">Requerimientos Específicos o Comentarios (Opcional)</label>
                <textarea id="mensaje" class="form-textarea" placeholder="Indícanos volumen estimado de siniestros, requerimientos de cobertura o puntos clave de tu operación..."></textarea>
              </div>

              <button type="submit" class="btn-send-partner">
                <span>Enviar propuesta de colaboración por WhatsApp</span>
                <span class="btn-partner-icon"><i class="fa-solid fa-arrow-right"></i></span>
              </button>

              <p class="form-note">
                <i class="fa-solid fa-shield-halved"></i> Tu información se procesa confidencialmente para coordinar la sesión de enlace comercial.
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer id="contacto">
    <div class="container">
      <div class="footer-grid">
        <!-- Col 1: Brand Info -->
        <div class="footer-brand">
          <!-- Embedded crisp high resolution transparent logo for dark background with white subtitle -->
          <img src="data:image/png;base64,__LOGO_DARK_B64__" alt="DAREY Ajustadores Profesionales S.C.">
          <p>
            Soluciones profesionales en ajuste de siniestros. Experiencia, precisión técnica y trato humano protegiendo la imagen de nuestros socios comerciales.
          </p>
          <div class="social-links">
            <a href="#" class="social-btn" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="social-btn" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" class="social-btn" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>

        <!-- Col 2: Navigation Links -->
        <div>
          <h4 class="footer-title">Enlaces Rápidos</h4>
          <ul class="footer-links">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#nosotros">Quiénes Somos</a></li>
            <li><a href="#valores">Pilares y Compromisos</a></li>
            <li><a href="#proceso">Proceso Operativo</a></li>
            <li><a href="#cobertura">Cobertura Regional</a></li>
            <li><a href="#socios">Socios Comerciales</a></li>
            <li><a href="#alianza">Alianzas para Socios</a></li>
            <li><a href="./integrador/" style="font-size: 13px; opacity: 0.8;"><i class="fa-solid fa-lock" style="font-size: 11px; margin-right: 5px;"></i> Integrador Documental</a></li>
          </ul>
        </div>

        <!-- Col 3: Legal & Corporate -->
        <div>
          <h4 class="footer-title">DAREY S.C.</h4>
          <div class="footer-contact-item">
            <i class="fa-solid fa-shield-halved"></i>
            <div>
              <strong>DAREY Ajustadores Profesionales S.C.</strong>
              <span>Soluciones en campo para el sector asegurador</span>
            </div>
          </div>
          <div class="footer-contact-item">
            <i class="fa-solid fa-location-dot"></i>
            <div>
              <strong>San Luis Potosí, S.L.P.</strong>
              <span>Base central de coordinación regional</span>
            </div>
          </div>
          <div class="footer-contact-item">
            <i class="fa-solid fa-envelope"></i>
            <div>
              <strong>contacto@darey.com.mx</strong>
              <span>Atención a aseguradoras y socios</span>
            </div>
          </div>
        </div>

        <!-- Col 4: Top button & Seal -->
        <div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between;">
          <div>
            <h4 class="footer-title">Lema</h4>
            <p style="color: var(--cian); font-weight: 700; font-size: 14px;">Profesionalismo en movimiento.</p>
          </div>
          <a href="#inicio" class="back-to-top" aria-label="Volver arriba">
            <i class="fa-solid fa-arrow-up"></i>
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 DAREY Ajustadores Profesionales S.C. Todos los derechos reservados.</p>
        <p>Alianzas Estratégicas y Soluciones en Campo · San Luis Potosí</p>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script>
    // Mobile navigation toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-bars');
          icon.classList.toggle('fa-xmark');
        }
      });

      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          const icon = mobileToggle.querySelector('i');
          if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
          }
        });
      });
    }

    // Interactive WhatsApp message builder for New B2B Partners
    function handlePartnerSubmit(event) {
      event.preventDefault();
      
      const nombre = document.getElementById('nombreContacto').value.trim();
      const empresa = document.getElementById('empresa').value.trim();
      const tipoOrg = document.getElementById('tipoOrganizacion').value;
      const telefono = document.getElementById('telefono').value.trim();
      const correo = document.getElementById('correo').value.trim();
      const zona = document.getElementById('zonaInteres').value;
      const solucion = document.getElementById('solucionRequerida').value;
      const mensaje = document.getElementById('mensaje').value.trim();

      const phone = '524440000000';

      let msg = '*🤝 NUEVA PROPUESTA DE ALIANZA - DAREY S.C. 🤝*\\n';
      msg += '━━━━━━━━━━━━━━━━━━━━\\n';
      msg += '👤 *Contacto:* ' + nombre + '\\n';
      msg += '🏢 *Empresa:* ' + empresa + '\\n';
      msg += '📌 *Giro / Organización:* ' + tipoOrg + '\\n';
      msg += '📞 *Teléfono:* ' + telefono + '\\n';
      msg += '✉️ *Correo:* ' + correo + '\\n';
      msg += '📍 *Zona de Interés:* ' + zona + '\\n';
      msg += '⚙️ *Solución Requerida:* ' + solucion + '\\n';
      if (mensaje) {
        msg += '📝 *Comentarios / Requerimientos:* ' + mensaje + '\\n';
      }
      msg += '━━━━━━━━━━━━━━━━━━━━\\n';
      msg += '_Solicitud de alianza recibida desde portal web DAREY_';

      const encodedMsg = encodeURIComponent(msg);
      const whatsappUrl = 'https://api.whatsapp.com/send?phone=' + phone + '&text=' + encodedMsg;
      
      window.open(whatsappUrl, '_blank');
    }
  </script>
</body>
</html>
"""

output = template.replace('__LOGO_LIGHT_B64__', b64_light)
output = output.replace('__LOGO_DARK_B64__', b64_dark)
output = output.replace('__ICON_B64__', b64_icon)

with open('darey/index.html', 'w', encoding='utf-8') as f:
    f.write(output)

print('Build completed with subtle integrador link. Size:', len(output))

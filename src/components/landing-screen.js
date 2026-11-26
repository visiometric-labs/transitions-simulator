import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';
import { Avatar3DEngine } from '../core/avatar-3d-engine.js';

export class LandingScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.heroAvatar3D = null;
    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('div');
    this.element.id = 'landing-screen';
    this.element.className = 'landing-overlay screen-fade screen-visible';

    this.element.innerHTML = `
      <!-- Retículas Ópticas de Fondo -->
      <svg class="landing-bg-reticle" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="400" cy="400" r="380" stroke="rgba(56, 189, 248, 0.15)" stroke-width="1.5" stroke-dasharray="4 8" />
        <circle cx="400" cy="400" r="280" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.2" />
        <circle cx="400" cy="400" r="180" stroke="rgba(56, 189, 248, 0.20)" stroke-width="1.5" />
        <circle cx="400" cy="400" r="80" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1" />
        <line x1="20" y1="400" x2="780" y2="400" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
        <line x1="400" y1="20" x2="400" y2="780" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
      </svg>

      <!-- Cabecera Superior -->
      <header class="landing-header">
        <div class="landing-brand">
          <div class="landing-brand-icon">
            <img src="./branding/favicon.svg" alt="Luminix Logo" width="38" height="38" />
          </div>
          <div class="landing-brand-text">
            <span class="landing-brand-title">Luminix</span>
            <span class="landing-brand-sub">by Visiometric Labs • JayzirTech</span>
          </div>
        </div>

        <!-- Acciones en Cabecera: Botón Salir de Pantalla Completa (condicional) + Badge 4K -->
        <div class="landing-header-actions">
          <button type="button" class="btn-exit-fullscreen-landing" id="btn-landing-exit-fullscreen" title="Salir de pantalla completa" aria-label="Salir de pantalla completa">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </svg>
            <span>Salir de Pantalla Completa</span>
          </button>

          <div class="landing-badge-pill">
            <span class="landing-badge-dot"></span>
            <span>Simulador Clínico 4K</span>
          </div>
        </div>
      </header>

      <!-- Panel Lateral Izquierdo: Información Tecnológica Transitions Gen S -->
      <aside class="landing-info-card landing-info-left" aria-label="Información Tecnológica">
        <div class="info-card-header">
          <div class="info-pill-tag">TECNOLOGÍA ÓPTICA</div>
          <h3 class="info-card-title">Transitions® Gen S™</h3>
        </div>
        <p class="info-card-desc">
          La nueva frontera de lentes fotosensibles inteligentes con dinámica cinética acelerada a la radiación lumínica.
        </p>
        <div class="info-features-list">
          <div class="info-feature-item">
            <div class="info-feature-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            </div>
            <div class="info-feature-text">
              <span class="info-feature-label">Cinética Ultrarrápida</span>
              <span class="info-feature-sub">Activación en 25 segundos al exterior y aclarado récord en interiores.</span>
            </div>
          </div>

          <div class="info-feature-item">
            <div class="info-feature-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="info-feature-text">
              <span class="info-feature-label">Protección 100% UV</span>
              <span class="info-feature-sub">Bloqueo absoluto de rayos UVA/UVB y filtrado selectivo de luz azul nociva.</span>
            </div>
          </div>

          <div class="info-feature-item">
            <div class="info-feature-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/>
              </svg>
            </div>
            <div class="info-feature-text">
              <span class="info-feature-label">8 Tonalidades Rubí & Zafiro</span>
              <span class="info-feature-sub">Paleta vibrante con máxima fidelidad visual y nitidez sin distorsión.</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Panel Lateral Derecho: Información de la Cabina Clínica Interactiva -->
      <aside class="landing-info-card landing-info-right" aria-label="Información de la Demostración">
        <div class="info-card-header">
          <div class="info-pill-tag">CABINA EN MOSTRADOR</div>
          <h3 class="info-card-title">Simulador Clínico</h3>
        </div>
        <p class="info-card-desc">
          Herramienta pedagógica de asesoramiento optométrico para punto de venta y toma informada de decisión del paciente.
        </p>
        <div class="info-features-list">
          <div class="info-feature-item">
            <div class="info-feature-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div class="info-feature-text">
              <span class="info-feature-label">Visión Binocular POV</span>
              <span class="info-feature-sub">Experimenta en primera persona la absorción de luz sin pérdida de contraste.</span>
            </div>
          </div>

          <div class="info-feature-item">
            <div class="info-feature-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="info-feature-text">
              <span class="info-feature-label">Probador Facial en Tiempo Real</span>
              <span class="info-feature-sub">Avatar facial 3D reactivo que exhibe el oscurecimiento real del cristal.</span>
            </div>
          </div>

          <div class="info-feature-item">
            <div class="info-feature-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div class="info-feature-text">
              <span class="info-feature-label">4 Familias Especializadas</span>
              <span class="info-feature-sub">Compara Signature Gen S, XTRActive Polarized, Style Mirrors y Estándar.</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Contenedor Central: Avatar Hero y Selector de Tinte -->
      <div class="landing-hero-container">
        <!-- Avatar Hero Central (3D Real con Three.js y esqueleto .glb interactivo) -->
        <div id="landing-hero-stage" class="landing-hero-center">
          <!-- Canvas 3D de Three.js montado dinámicamente -->
        </div>

        <!-- Selector Sutil de Tinte de Cristales para el Avatar en Portada (Mismo ancho que el marco del avatar) -->
        <div class="landing-hero-tint-bar" role="toolbar" aria-label="Probar tinte de cristales en el avatar">
          <span class="hero-tint-label">Tinte del cristal:</span>
          <div class="hero-tint-swatches">
            <button type="button" class="hero-tint-btn active" data-lens-id="gens-amethyst" title="Amatista (Signature Gen S)" style="--swatch-color: #8B5CF6;" aria-label="Tinte Amatista"></button>
            <button type="button" class="hero-tint-btn" data-lens-id="gens-ruby" title="Rubí (Signature Gen S)" style="--swatch-color: #E11D48;" aria-label="Tinte Rubí"></button>
            <button type="button" class="hero-tint-btn" data-lens-id="gens-sapphire" title="Zafiro (Signature Gen S)" style="--swatch-color: #3B82F6;" aria-label="Tinte Zafiro"></button>
            <button type="button" class="hero-tint-btn" data-lens-id="gens-emerald" title="Esmeralda (Signature Gen S)" style="--swatch-color: #10B981;" aria-label="Tinte Esmeralda"></button>
            <button type="button" class="hero-tint-btn" data-lens-id="xtractive-amber" title="Ámbar (XTRActive)" style="--swatch-color: #F59E0B;" aria-label="Tinte Ámbar"></button>
            <button type="button" class="hero-tint-btn" data-lens-id="xtractive-gray" title="Gris Grafito (XTRActive)" style="--swatch-color: #64748B;" aria-label="Tinte Gris"></button>
          </div>
        </div>
      </div>

      <!-- Pie de Página y Botón CTA Central -->
      <footer class="landing-footer">
        <button id="cta-start-experience" class="cta-button-main" type="button" aria-label="Iniciar experiencia de simulación">
          <div class="cta-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <span class="cta-text">INICIAR EXPERIENCIA</span>
        </button>
        <span class="cta-subtitle">Toque para comenzar la demostración clínica</span>

        <!-- Derechos de Autor Institucionales -->
        <div class="landing-copyright">
          <div>© <span id="copyright-year">2026</span> JayzirTech. Todos los derechos reservados. • Luminix by Visiometric Labs</div>
          <div class="copyright-sub">Plataforma clínica de demostración fotosensible y probador Transitions® en mostrador.</div>
        </div>
      </footer>
    `;

    this.container.appendChild(this.element);

    // Inicializar Avatar 3D Hero
    const heroStage = this.element.querySelector('#landing-hero-stage');
    this.heroAvatar3D = new Avatar3DEngine(heroStage, {
      isHero: true,
      cameraFov: 23,
      cameraY: 1.62,
      cameraZ: 1.35,
      targetY: 1.58
    });
  }

  bindEvents() {
    const startBtn = this.element.querySelector('#cta-start-experience');
    const exitFsBtn = this.element.querySelector('#btn-landing-exit-fullscreen');
    const yearEl = this.element.querySelector('#copyright-year');

    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    startBtn.addEventListener('click', () => {
      this.handleStartExperience();
    });

    // Selector sutil de tinte de cristales en portada
    const tintBtns = this.element.querySelectorAll('.hero-tint-btn');
    tintBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lensId = btn.getAttribute('data-lens-id');
        simulatorState.setLens(lensId);

        tintBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const currentLens = simulatorState.getCurrentLens();
        if (this.heroAvatar3D) {
          this.heroAvatar3D.updateGlassesTint(currentLens, 0.72);
        }
      });
    });

    // Mantener selector de portada sincronizado si la lente cambia
    eventBus.on('lens:change', ({ lens }) => {
      tintBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lens-id') === lens.id);
      });
    });

    // Control de pantalla completa: EN LA PORTADA SOLO APARECE BOTÓN DE SALIR SI ESTÁ EN PANTALLA COMPLETA
    const updateFsVisibility = () => {
      const isFs = !!document.fullscreenElement;
      if (exitFsBtn) {
        exitFsBtn.classList.toggle('visible', isFs);
      }
    };

    if (exitFsBtn) {
      exitFsBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    document.addEventListener('fullscreenchange', updateFsVisibility);
    updateFsVisibility();

    eventBus.on('screen:change', ({ screen }) => {
      if (screen === 'landing') {
        this.element.style.display = 'flex';
        this.element.style.pointerEvents = 'auto';
        requestAnimationFrame(() => {
          this.element.classList.remove('screen-hidden');
          this.element.classList.add('screen-visible');
        });
        updateFsVisibility();
      } else {
        this.element.classList.remove('screen-visible');
        this.element.classList.add('screen-hidden');
        this.element.style.pointerEvents = 'none';
        setTimeout(() => {
          if (simulatorState.screen !== 'landing') {
            this.element.style.display = 'none';
          }
        }, 360);
      }
    });
  }

  handleStartExperience() {
    // 1. Inmediatamente desactivar puntero y animar desvanecimiento
    this.element.classList.remove('screen-visible');
    this.element.classList.add('screen-hidden');
    this.element.style.pointerEvents = 'none';

    // 2. Transición a pantalla completa si es compatible
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    // 3. Cambiar estado a experiencia en el simulador
    simulatorState.setScreen('experience');

    // 4. Ocultar completamente del DOM tras la animación
    setTimeout(() => {
      if (simulatorState.screen === 'experience') {
        this.element.style.display = 'none';
      }
    }, 360);
  }
}

import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';

export class LandingScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
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
        <div class="landing-brand-pill">
          <div class="landing-brand-icon">
            <img src="./branding/favicon.svg" alt="Luminix Logo" width="38" height="38" />
          </div>
          <div class="landing-brand-text">
            <span class="landing-brand-title">LUMINIX</span>
            <span class="landing-brand-sub">by Visiometric Labs</span>
          </div>
        </div>
      </header>

      <!-- Indicadores Laterales HUD -->
      <aside class="landing-side-hud-left" aria-hidden="true">
        <div class="hud-slider-widget">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
          <div class="hud-slider-track">
            <div class="hud-slider-thumb" style="top: 35%;"></div>
          </div>
          <div style="width: 14px; height: 2px; background: rgba(255,255,255,0.2);"></div>
        </div>

        <div class="hud-curve-card">
          <svg width="110" height="60" viewBox="0 0 110 60" fill="none">
            <path d="M 5 15 C 35 15, 65 50, 105 50" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 5 15 C 35 15, 65 50, 105 50 L 105 58 L 5 58 Z" fill="url(#cyanCurveGrad)" opacity="0.25" />
            <defs>
              <linearGradient id="cyanCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#38BDF8" />
                <stop offset="100%" stop-color="#38BDF8" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </aside>

      <aside class="landing-side-hud-right" aria-hidden="true">
        <div class="hud-slider-widget">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/>
          </svg>
          <div class="hud-slider-track">
            <div class="hud-slider-thumb amber" style="top: 60%;"></div>
          </div>
          <div style="width: 14px; height: 2px; background: rgba(255,255,255,0.2);"></div>
        </div>

        <div class="hud-curve-card">
          <svg width="110" height="60" viewBox="0 0 110 60" fill="none">
            <path d="M 5 50 C 45 50, 75 15, 105 15" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 5 50 C 45 50, 75 15, 105 15 L 105 58 L 5 58 Z" fill="url(#amberCurveGrad)" opacity="0.25" />
            <defs>
              <linearGradient id="amberCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#F59E0B" />
                <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </aside>

      <!-- Avatar Hero Central (En primer plano grande con respiración viva) -->
      <div class="landing-hero-center">
        <img class="landing-avatar-image" src="./avatar/avatar-hero.jpg" alt="Avatar Luminix" />
      </div>

      <!-- Pie de Página y Botón CTA Central -->
      <footer class="landing-footer">
        <button id="cta-start-experience" class="cta-button-main" type="button" aria-label="Iniciar experiencia de simulación">
          <div class="cta-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </div>
          <span class="cta-text">INICIAR EXPERIENCIA</span>
        </button>
        <span class="cta-subtitle">Toque para comenzar la demostración clínica</span>
      </footer>
    `;

    this.container.appendChild(this.element);
  }

  bindEvents() {
    const startBtn = this.element.querySelector('#cta-start-experience');
    startBtn.addEventListener('click', () => {
      this.handleStartExperience();
    });

    eventBus.on('screen:change', ({ screen }) => {
      if (screen === 'landing') {
        this.element.classList.remove('screen-hidden');
        this.element.classList.add('screen-visible');
      } else {
        this.element.classList.remove('screen-visible');
        this.element.classList.add('screen-hidden');
      }
    });
  }

  handleStartExperience() {
    // Solicitud de pantalla completa en tablet/pantalla de óptica si es soportado
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Pantalla completa no disponible o denegada:', err);
      });
    }

    // Efecto de sonido sintetizado clínico estéreo
    this.playStartChime();

    // Transicionar al estado de experiencia
    simulatorState.setScreen('experience');
  }

  playStartChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.56);
    } catch {
      // Audio silencioso si no está habilitado
    }
  }
}

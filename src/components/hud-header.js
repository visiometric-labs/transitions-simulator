import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';

export class HudHeader {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('header');
    this.element.className = 'hud-header-container';

    this.element.innerHTML = `
      <!-- 1. Marca y Logo (Superior Izquierda) -->
      <div id="btn-return-landing" class="brand-badge" title="Volver a la portada de bienvenida">
        <span class="brand-title">Luminix</span>
        <span class="brand-sub">by Visiometric Labs</span>
      </div>

      <!-- 2. Medidor Central de Intensidad Read-Only -->
      <div class="hud-meter-container" aria-live="polite">
        <div class="meter-track-wrapper">
          <div class="meter-bar-bg">
            <div id="meter-fill" class="meter-bar-fill" style="width: 12%;"></div>
          </div>
          <div class="meter-legend">
            <span id="meter-text">88% Absorción - Cat. 3 Sol Intenso</span>
          </div>
        </div>

        <div class="meter-uv-pill">
          <span class="meter-uv-label">UV</span>
          <span id="meter-uv-val" class="meter-uv-value">9.2</span>
        </div>
      </div>

      <!-- 3. Conmutador de Escenas Clínicas (Superior Derecha) -->
      <div class="scene-switcher-container" role="radiogroup" aria-label="Selección de Escena Clínica">
        <button id="scene-btn-park" class="scene-btn active" type="button" role="radio" aria-checked="true">
          Parque Familiar
        </button>
        <button id="scene-btn-museum" class="scene-btn" type="button" role="radio" aria-checked="false">
          Museo de Arte
        </button>
      </div>
    `;

    this.container.appendChild(this.element);
  }

  bindEvents() {
    const returnBtn = this.element.querySelector('#btn-return-landing');
    const parkBtn = this.element.querySelector('#scene-btn-park');
    const museumBtn = this.element.querySelector('#scene-btn-museum');
    const meterFill = this.element.querySelector('#meter-fill');
    const meterText = this.element.querySelector('#meter-text');
    const meterUv = this.element.querySelector('#meter-uv-val');

    // Click en Marca -> Retornar a Portada
    returnBtn.addEventListener('click', () => {
      simulatorState.setScreen('landing');
    });

    // Conmutar a Parque Familiar
    parkBtn.addEventListener('click', () => {
      simulatorState.setScene('park');
    });

    // Conmutar a Museo de Arte
    museumBtn.addEventListener('click', () => {
      simulatorState.setScene('museum');
    });

    // Actualización de estado de escena
    eventBus.on('scene:change', ({ sceneId }) => {
      if (sceneId === 'park') {
        parkBtn.classList.add('active');
        parkBtn.setAttribute('aria-checked', 'true');
        museumBtn.classList.remove('active');
        museumBtn.setAttribute('aria-checked', 'false');
      } else {
        museumBtn.classList.add('active');
        museumBtn.setAttribute('aria-checked', 'true');
        parkBtn.classList.remove('active');
        parkBtn.setAttribute('aria-checked', 'false');
      }
    });

    // Actualización cinética en tiempo real (60 FPS)
    eventBus.on('kinetic:update', ({ absorptionPercentage, uvIndex, category, lens }) => {
      meterFill.style.width = `${Math.max(5, Math.min(100, absorptionPercentage))}%`;
      meterText.textContent = `${absorptionPercentage}% Absorción - ${category}`;
      meterUv.textContent = uvIndex;

      // Adaptar color del medidor al tinte de la lente
      if (lens) {
        meterFill.style.background = `linear-gradient(90deg, #38BDF8, ${lens.colorHex})`;
      }
    });
  }
}

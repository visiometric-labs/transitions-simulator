import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';

/**
 * Gestor Maestro de Escenarios y Deslumbramiento Natural Equilibrado.
 * Implementa una proyección SVG idéntica a la vista POV de las gafas,
 * garantizando sincronización milimétrica y cero lag fotograma a fotograma.
 */
export class SceneManager {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.worldPanGroup = null;
    this.currentScene = simulatorState.getCurrentScene();
    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('div');
    this.element.id = 'scene-background-manager';
    this.element.className = 'scene-background-layer';

    const isPark = this.currentScene.id === 'park';

    // SVG Panorámico con la misma resolución viewBox 1920x1080 y encuadre slice que las gafas
    this.element.innerHTML = `
      <svg id="scene-bg-svg" class="scene-svg-canvas" width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Corona solar moderada en ángulo del sol (X: 70%, Y: 16%) -->
          <radialGradient id="solarGlowGrad" cx="70%" cy="16%" r="50%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.65" />
            <stop offset="15%" stop-color="#FFF8DC" stop-opacity="0.45" />
            <stop offset="35%" stop-color="#FDE68A" stop-opacity="0.22" />
            <stop offset="65%" stop-color="#FBBF24" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
          </radialGradient>

          <!-- Rayos solares dorados suaves -->
          <linearGradient id="sunbeamsGrad" x1="70%" y1="16%" x2="20%" y2="90%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.45" />
            <stop offset="40%" stop-color="#FFFBEB" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
          </linearGradient>

          <!-- Velo de pérdida de contraste suave -->
          <radialGradient id="veilingGlareGrad" cx="65%" cy="20%" r="75%">
            <stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.18" />
            <stop offset="50%" stop-color="#FEF3C7" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.02" />
          </radialGradient>

          <!-- Focos Museo de Arte -->
          <radialGradient id="museumSpotGrad1" cx="30%" cy="12%" r="40%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.45" />
            <stop offset="30%" stop-color="#E0F2FE" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#38BDF8" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="museumSpotGrad2" cx="72%" cy="15%" r="45%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.48" />
            <stop offset="30%" stop-color="#FEF3C7" stop-opacity="0.20" />
            <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- ============================================================== -->
        <!-- GRUPO MAESTRO DE PANEO MUNDIAL (Sincronizado al sub-píxel)      -->
        <!-- ============================================================== -->
        <g id="scene-world-pan-group">

          <!-- 1. ESCENA PARQUE FAMILIAR (EXTERIORES) -->
          <g id="scene-group-park" style="opacity: ${isPark ? '1' : '0'}; transition: opacity 200ms ease-in-out;">
            <!-- Capa 1: Base Fotográfica -->
            <image href="./scenes/parque-familiar.jpg" 
                   x="-160" y="-85" width="2240" height="1250" 
                   preserveAspectRatio="xMidYMid slice" 
                   style="filter: brightness(1.13) contrast(1.05) saturate(1.02);" />

            <!-- Capa 2: Resplandor Fotónico / Bloom natural -->
            <image href="./scenes/parque-familiar.jpg" 
                   x="-160" y="-85" width="2240" height="1250" 
                   preserveAspectRatio="xMidYMid slice" 
                   style="mix-blend-mode: screen; opacity: 0.35; filter: blur(10px) brightness(1.40) contrast(1.18) saturate(1.10);" />

            <!-- Capa 3: Puntos Calientes Especulares (Hotspots) -->
            <image href="./scenes/parque-familiar.jpg" 
                   x="-160" y="-85" width="2240" height="1250" 
                   preserveAspectRatio="xMidYMid slice" 
                   style="mix-blend-mode: color-dodge; opacity: 0.22; filter: blur(2px) brightness(1.60) contrast(1.70);" />

            <!-- Capa 4: Velo de Deslumbramiento Solar y Rayos Moderados -->
            <g style="opacity: 0.52; mix-blend-mode: screen;">
              <circle cx="1344" cy="172" r="280" fill="url(#solarGlowGrad)" />
              <polygon points="1344,172 0,400 0,650" fill="url(#sunbeamsGrad)" opacity="0.32" />
              <polygon points="1344,172 200,1080 600,1080" fill="url(#sunbeamsGrad)" opacity="0.26" />
              <polygon points="1344,172 1100,1080 1600,1080" fill="url(#sunbeamsGrad)" opacity="0.20" />
              <ellipse cx="1344" cy="172" rx="600" ry="8" fill="rgba(255, 255, 255, 0.20)" />
              <rect x="-160" y="-85" width="2240" height="1250" fill="url(#veilingGlareGrad)" />
            </g>
          </g>

          <!-- 2. ESCENA MUSEO DE ARTE (INTERIORES) -->
          <g id="scene-group-museum" style="opacity: ${isPark ? '0' : '1'}; transition: opacity 200ms ease-in-out;">
            <!-- Capa 1: Base Fotográfica equilibrada -->
            <image href="./scenes/museo-arte.jpg" 
                   x="-160" y="-85" width="2240" height="1250" 
                   preserveAspectRatio="xMidYMid slice" 
                   style="filter: brightness(1.08) contrast(1.06);" />

            <!-- Capa 2: Resplandor de Focos Halógenos suave -->
            <image href="./scenes/museo-arte.jpg" 
                   x="-160" y="-85" width="2240" height="1250" 
                   preserveAspectRatio="xMidYMid slice" 
                   style="mix-blend-mode: screen; opacity: 0.30; filter: blur(12px) brightness(1.35) contrast(1.18);" />

            <!-- Capa 3: Puntos Calientes suaves -->
            <image href="./scenes/museo-arte.jpg" 
                   x="-160" y="-85" width="2240" height="1250" 
                   preserveAspectRatio="xMidYMid slice" 
                   style="mix-blend-mode: color-dodge; opacity: 0.20; filter: blur(2px) brightness(1.50) contrast(1.60);" />

            <!-- Capa 4: Focos Cenitales suaves -->
            <g style="opacity: 0.50;">
              <circle cx="576" cy="130" r="220" fill="url(#museumSpotGrad1)" />
              <circle cx="1382" cy="162" r="260" fill="url(#museumSpotGrad2)" />
              <ellipse cx="960" cy="980" rx="500" ry="40" fill="rgba(255, 255, 255, 0.10)" />
            </g>
          </g>

        </g>
      </svg>
    `;

    this.container.appendChild(this.element);
    this.worldPanGroup = this.element.querySelector('#scene-world-pan-group');
  }

  bindEvents() {
    const parkGroup = this.element.querySelector('#scene-group-park');
    const museumGroup = this.element.querySelector('#scene-group-museum');

    // Transición sincronizada exacta a 200ms entre Parque y Museo
    eventBus.on('scene:change', ({ sceneId }) => {
      const isPark = sceneId === 'park';
      if (parkGroup) parkGroup.style.opacity = isPark ? '1' : '0';
      if (museumGroup) museumGroup.style.opacity = isPark ? '0' : '1';
    });

    // Paneo dinámico del mundo en primera persona: sincronización directa sin retardo CSS
    eventBus.on('gaze:update', ({ gazeX, gazeY }) => {
      if (!this.worldPanGroup) return;
      const worldPanX = -gazeX * 120;
      const worldPanY = -gazeY * 70;
      this.worldPanGroup.setAttribute('transform', `translate(${worldPanX.toFixed(1)}, ${worldPanY.toFixed(1)})`);
    });
  }
}

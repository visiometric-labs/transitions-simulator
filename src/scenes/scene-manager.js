import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';

/**
 * Gestor Maestro de Escenarios y Deslumbramiento Natural Equilibrado.
 * Calibrado con reducción del 50% para lograr una iluminación solar realista y agradable,
 * manteniendo el contraste con la protección fotosensible de los lentes Transitions®.
 */
export class SceneManager {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.panContainer = null;
    this.currentScene = simulatorState.getCurrentScene();
    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('div');
    this.element.id = 'scene-background-manager';
    this.element.className = 'scene-background-layer';

    const isPark = this.currentScene.id === 'park';

    this.element.innerHTML = `
      <!-- Contenedor Paneo Panorámico Dinámico -->
      <div id="scene-pan-container" class="scene-pan-container">
        
        <!-- ============================================== -->
        <!-- 1. GRUPO ESCENA: PARQUE FAMILIAR (EXTERIORES)  -->
        <!-- Deslumbramiento equilibrado (reducido 50%)     -->
        <!-- ============================================== -->
        <div id="scene-group-park" class="scene-group" style="opacity: ${isPark ? '1' : '0'};">
          <!-- Capa 1: Base Fotográfica con luz solar natural equilibrada -->
          <div class="scene-layer-base" style="background-image: url('./scenes/parque-familiar.jpg'); filter: brightness(1.13) contrast(1.05) saturate(1.02);"></div>

          <!-- Capa 2: Resplandor Fotónico Suave / Bloom natural (reducido 50%) -->
          <div class="scene-layer-bloom" style="background-image: url('./scenes/parque-familiar.jpg'); filter: blur(10px) brightness(1.40) contrast(1.18) saturate(1.10); opacity: 0.35;"></div>

          <!-- Capa 3: Puntos Calientes Especulares sutiles (reducidos 50%) -->
          <div class="scene-layer-hotspots" style="background-image: url('./scenes/parque-familiar.jpg'); filter: blur(2px) brightness(1.60) contrast(1.70); opacity: 0.22;"></div>

          <!-- Capa 4: Velo de Deslumbramiento Solar y Rayos Moderados (reducido 50%) -->
          <svg class="scene-layer-solar-flare" viewBox="0 0 1920 1080" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.52;">
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
            </defs>

            <!-- Disco Solar Incandescente y Corona Moderada -->
            <circle cx="1344" cy="172" r="280" fill="url(#solarGlowGrad)" />

            <!-- Rayos solares moderados -->
            <polygon points="1344,172 0,400 0,650" fill="url(#sunbeamsGrad)" opacity="0.32" />
            <polygon points="1344,172 200,1080 600,1080" fill="url(#sunbeamsGrad)" opacity="0.26" />
            <polygon points="1344,172 1100,1080 1600,1080" fill="url(#sunbeamsGrad)" opacity="0.20" />

            <!-- Destello horizontal sutil -->
            <ellipse cx="1344" cy="172" rx="600" ry="8" fill="rgba(255, 255, 255, 0.20)" />

            <!-- Velo general suave -->
            <rect width="1920" height="1080" fill="url(#veilingGlareGrad)" />
          </svg>
        </div>

        <!-- ============================================== -->
        <!-- 2. GRUPO ESCENA: MUSEO DE ARTE (INTERIORES)    -->
        <!-- Iluminación interior moderada (reducida 50%)   -->
        <!-- ============================================== -->
        <div id="scene-group-museum" class="scene-group" style="opacity: ${isPark ? '0' : '1'};">
          <!-- Capa 1: Base Fotográfica equilibrada -->
          <div class="scene-layer-base" style="background-image: url('./scenes/museo-arte.jpg'); filter: brightness(1.08) contrast(1.06);"></div>

          <!-- Capa 2: Resplandor de Focos Halógenos suave (reducido 50%) -->
          <div class="scene-layer-bloom" style="background-image: url('./scenes/museo-arte.jpg'); filter: blur(12px) brightness(1.35) contrast(1.18); opacity: 0.30;"></div>

          <!-- Capa 3: Puntos Calientes suaves (reducidos 50%) -->
          <div class="scene-layer-hotspots" style="background-image: url('./scenes/museo-arte.jpg'); filter: blur(2px) brightness(1.50) contrast(1.60); opacity: 0.20;"></div>

          <!-- Capa 4: Focos Cenitales suaves -->
          <svg class="scene-layer-solar-flare" viewBox="0 0 1920 1080" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.50;">
            <defs>
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

            <!-- Foco Cenital 1 -->
            <circle cx="576" cy="130" r="220" fill="url(#museumSpotGrad1)" />
            <!-- Foco Cenital 2 -->
            <circle cx="1382" cy="162" r="260" fill="url(#museumSpotGrad2)" />
            <!-- Reflejo en suelo pulido -->
            <ellipse cx="960" cy="980" rx="500" ry="40" fill="rgba(255, 255, 255, 0.10)" />
          </svg>
        </div>

      </div>
    `;

    this.container.appendChild(this.element);
    this.panContainer = this.element.querySelector('#scene-pan-container');
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

    // Paneo dinámico de la escena en primera persona según la mirada voluntaria del paciente
    eventBus.on('gaze:update', ({ gazeX, gazeY }) => {
      if (!this.panContainer) return;
      // Paneo suave en contraposición a la mirada (parallax de cámara)
      const panX = -gazeX * 85;
      const panY = -gazeY * 60;
      this.panContainer.style.transform = `translate3d(${panX.toFixed(1)}px, ${panY.toFixed(1)}px, 0)`;
    });
  }
}

import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';

/**
 * Gestor Maestro de Escenarios y Deslumbramiento Multinivel.
 * Renderiza múltiples capas graduadas de luz, resplandor fotónico (bloom),
 * puntos calientes especulares y destello solar cegador en la visión al descubierto (sin gafas),
 * permitiendo al paciente experimentar el deslumbramiento real y su contraste con los lentes Transitions®.
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
        <!-- ============================================== -->
        <div id="scene-group-park" class="scene-group" style="opacity: ${isPark ? '1' : '0'};">
          <!-- Capa 1: Base Fotográfica con sobreexposición natural de mediodía -->
          <div class="scene-layer-base" style="background-image: url('./scenes/parque-familiar.jpg'); filter: brightness(1.26) contrast(1.10) saturate(1.05);"></div>

          <!-- Capa 2: Resplandor Fotónico / Halos de Alta Luz (Bloom corneal) -->
          <div class="scene-layer-bloom" style="background-image: url('./scenes/parque-familiar.jpg'); filter: blur(14px) brightness(1.85) contrast(1.40) saturate(1.25); opacity: 0.72;"></div>

          <!-- Capa 3: Puntos Calientes Especulares (Hotspots de acera, hojas y metal) -->
          <div class="scene-layer-hotspots" style="background-image: url('./scenes/parque-familiar.jpg'); filter: blur(2.5px) brightness(2.30) contrast(2.50); opacity: 0.48;"></div>

          <!-- Capa 4: Velo de Deslumbramiento Solar y Destello Anamórfico Cegador -->
          <svg class="scene-layer-solar-flare" viewBox="0 0 1920 1080" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Corona solar intensa centrada en el ángulo del sol (X: 70%, Y: 16%) -->
              <radialGradient id="solarGlowGrad" cx="70%" cy="16%" r="65%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
                <stop offset="12%" stop-color="#FFF8DC" stop-opacity="0.80" />
                <stop offset="30%" stop-color="#FDE68A" stop-opacity="0.45" />
                <stop offset="55%" stop-color="#FBBF24" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
              </radialGradient>

              <!-- Haz de rayos solares volumétricos proyectados en diagonal -->
              <linearGradient id="sunbeamsGrad" x1="70%" y1="16%" x2="20%" y2="90%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.75" />
                <stop offset="35%" stop-color="#FFFBEB" stop-opacity="0.35" />
                <stop offset="70%" stop-color="#FEF3C7" stop-opacity="0.12" />
                <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
              </linearGradient>

              <!-- Velo de pérdida de contraste atmosférico (Veiling Glare) -->
              <radialGradient id="veilingGlareGrad" cx="65%" cy="20%" r="85%">
                <stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.38" />
                <stop offset="45%" stop-color="#FEF3C7" stop-opacity="0.20" />
                <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.05" />
              </radialGradient>
            </defs>

            <!-- Disco Solar Incandescente y Corona -->
            <circle cx="1344" cy="172" r="480" fill="url(#solarGlowGrad)" />

            <!-- Rayos solares dorados volumétricos cruzando el cielo -->
            <polygon points="1344,172 0,400 0,650" fill="url(#sunbeamsGrad)" opacity="0.65" />
            <polygon points="1344,172 200,1080 600,1080" fill="url(#sunbeamsGrad)" opacity="0.55" />
            <polygon points="1344,172 1100,1080 1600,1080" fill="url(#sunbeamsGrad)" opacity="0.45" />

            <!-- Destello horizontal anamórfico del sol -->
            <ellipse cx="1344" cy="172" rx="900" ry="12" fill="rgba(255, 255, 255, 0.40)" />

            <!-- Velo general de deslumbramiento (Lava los detalles en visión directa sin gafas) -->
            <rect width="1920" height="1080" fill="url(#veilingGlareGrad)" />
          </svg>
        </div>

        <!-- ============================================== -->
        <!-- 2. GRUPO ESCENA: MUSEO DE ARTE (INTERIORES)    -->
        <!-- ============================================== -->
        <div id="scene-group-museum" class="scene-group" style="opacity: ${isPark ? '0' : '1'};">
          <!-- Capa 1: Base Fotográfica con iluminación de galería -->
          <div class="scene-layer-base" style="background-image: url('./scenes/museo-arte.jpg'); filter: brightness(1.20) contrast(1.14);"></div>

          <!-- Capa 2: Resplandor de Focos Halógenos y Tragaluces -->
          <div class="scene-layer-bloom" style="background-image: url('./scenes/museo-arte.jpg'); filter: blur(16px) brightness(1.70) contrast(1.35); opacity: 0.62;"></div>

          <!-- Capa 3: Puntos Calientes en Mármol Pulido y Cuadros -->
          <div class="scene-layer-hotspots" style="background-image: url('./scenes/museo-arte.jpg'); filter: blur(3px) brightness(2.05) contrast(2.20); opacity: 0.42;"></div>

          <!-- Capa 4: Focos Cenitales de Museo con Halos concéntricos -->
          <svg class="scene-layer-solar-flare" viewBox="0 0 1920 1080" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="museumSpotGrad1" cx="30%" cy="12%" r="40%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.85" />
                <stop offset="25%" stop-color="#E0F2FE" stop-opacity="0.40" />
                <stop offset="100%" stop-color="#38BDF8" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="museumSpotGrad2" cx="72%" cy="15%" r="45%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.90" />
                <stop offset="25%" stop-color="#FEF3C7" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- Foco Cenital 1 -->
            <circle cx="576" cy="130" r="320" fill="url(#museumSpotGrad1)" />
            <!-- Foco Cenital 2 -->
            <circle cx="1382" cy="162" r="380" fill="url(#museumSpotGrad2)" />
            <!-- Reflejo en suelo pulido -->
            <ellipse cx="960" cy="980" rx="700" ry="60" fill="rgba(255, 255, 255, 0.22)" />
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

    // Paneo dinámico de la escena en primera persona
    eventBus.on('gaze:update', ({ gazeX, gazeY }) => {
      if (!this.panContainer) return;
      // Paneo suave en contraposición a la mirada (parallax de cámara)
      const panX = -gazeX * 90;
      const panY = -gazeY * 65;
      this.panContainer.style.transform = `translate3d(${panX.toFixed(1)}px, ${panY.toFixed(1)}px, 0)`;
    });
  }
}

import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';

export class GlassesPOV {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.currentLens = simulatorState.getCurrentLens();
    this.currentScene = simulatorState.getCurrentScene();

    // Estado cinemático de la mirada en primera persona
    this.targetGazeX = 0;
    this.targetGazeY = 0;
    this.currentGazeX = 0;
    this.currentGazeY = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.hintDismissed = false;

    this.masterGroup = null;
    this.allSceneImages = [];

    this.render();
    this.bindEvents();
    this.startGazeLoop();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'glasses-pov-layer';

    const isPark = this.currentScene.id === 'park';

    // SVG 1920x1080 con apertura binocular panorámica natural y puente estilizado de 50px
    this.element.innerHTML = `
      <!-- Guía Visual Flotante para Paciente -->
      <div id="pov-gaze-hint" class="pov-gaze-hint-pill">
        <span class="pov-gaze-hint-dot"></span>
        <span>Arrastra la pantalla para mover la vista a voluntad y comparar con/sin gafas</span>
      </div>

      <!-- Botón Flotante para Recentrar la Mirada a Voluntad -->
      <button id="btn-recenter-gaze" class="btn-recenter-pill" type="button" title="Centrar mirada en primera persona">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>
        </svg>
        <span>Centrar vista</span>
      </button>

      <svg id="glasses-pov-svg" width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Máscara Lente Izquierdo (Apertura panorámica amplia) -->
          <clipPath id="left-lens-clip">
            <path d="M 230 290
                     C 480 250, 800 260, 935 340
                     C 955 450, 940 700, 880 770
                     C 760 840, 420 830, 260 760
                     C 190 680, 170 420, 230 290 Z" />
          </clipPath>

          <!-- Máscara Lente Derecho (Apertura panorámica amplia) -->
          <clipPath id="right-lens-clip">
            <path d="M 985 340
                     C 1120 260, 1440 250, 1690 290
                     C 1750 420, 1730 680, 1660 760
                     C 1500 830, 1160 840, 1040 770
                     C 980 700, 965 450, 985 340 Z" />
          </clipPath>

          <!-- Filtro de Desenfoque Fisiológico Leve en el Marco cercano (DoF) -->
          <filter id="frame-dof-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          <!-- Sombra Suave de Oclusión del Marco -->
          <filter id="frame-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
            <feOffset dx="0" dy="6" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.40" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- Degradado de Acetato Negro Mate Premium -->
          <linearGradient id="acetateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2D3748" />
            <stop offset="25%" stop-color="#1A202C" />
            <stop offset="70%" stop-color="#0F172A" />
            <stop offset="100%" stop-color="#232B3B" />
          </linearGradient>

          <!-- Bisel interno del cristal facetado -->
          <linearGradient id="facetBevelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.45)" />
            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.05)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.25)" />
          </linearGradient>

          <!-- Reflejo Espejado Dinámico (Style Mirrors) -->
          <linearGradient id="mirrorSheenGrad" x1="0%" y1="0%" x2="100%" y2="70%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.7)" />
            <stop offset="35%" stop-color="rgba(56,189,248,0.35)" />
            <stop offset="70%" stop-color="rgba(255,255,255,0.05)" />
            <stop offset="100%" stop-color="rgba(56,189,248,0.45)" />
          </linearGradient>
        </defs>

        <!-- ============================================== -->
        <!-- GRUPO MAESTRO ARTICULADO (FRAME + CRISTALES)  -->
        <!-- ============================================== -->
        <g id="glasses-pov-master-group">

          <!-- 1. CAPAS DE CRISTALES ÓPTICOS FILTRADOS (IZQ + DER) -->
          <!-- DENTRO DEL LENTE NO HAY DESLUMBRAMIENTO: Imagen nítida, confortable y protegida -->
          
          <!-- Lente Izquierdo -->
          <g clip-path="url(#left-lens-clip)">
            <!-- Escena Parque Familiar dentro del cristal (sin bloom ni deslumbramiento cegador) -->
            <image id="left-lens-scene-park" 
                   href="./scenes/parque-familiar.jpg" 
                   x="-80" y="-60" width="2080" height="1200" 
                   preserveAspectRatio="xMidYMid slice" 
                   style="opacity: ${isPark ? '1' : '0'}; filter: brightness(0.82) contrast(1.20) saturate(1.22); transition: opacity 200ms ease-in-out, filter 0.2s linear;" />

            <!-- Escena Museo de Arte dentro del cristal (sin focos molestos) -->
            <image id="left-lens-scene-museum" 
                   href="./scenes/museo-arte.jpg" 
                   x="-80" y="-60" width="2080" height="1200" 
                   preserveAspectRatio="xMidYMid slice" 
                   style="opacity: ${isPark ? '0' : '1'}; filter: brightness(0.84) contrast(1.18) saturate(1.15); transition: opacity 200ms ease-in-out, filter 0.2s linear;" />
            
            <!-- Capa de Tinte Fotosensible Primario Transitions (Multiply suave con color auténtico) -->
            <rect id="left-lens-tint" x="0" y="0" width="1920" height="1080" 
                  fill="rgb(110, 45, 190)" 
                  style="mix-blend-mode: multiply; opacity: 0.14; transition: opacity 0.15s linear, fill 0.35s ease;" />
            
            <!-- Capa de Efecto Espejo Flash (Style Mirrors) -->
            <rect id="left-lens-mirror" x="0" y="0" width="1920" height="1080" 
                  fill="url(#mirrorSheenGrad)" 
                  style="mix-blend-mode: overlay; opacity: 0; transition: opacity 0.3s ease;" />

            <!-- Reflejo Crizal Antirreflejo en Esquina Superior del Cristal -->
            <ellipse cx="540" cy="330" rx="220" ry="25" transform="rotate(-10 540 330)" 
                     fill="rgba(255,255,255,0.08)" style="mix-blend-mode: screen;" />
          </g>

          <!-- Lente Derecho -->
          <g clip-path="url(#right-lens-clip)">
            <!-- Escena Parque Familiar dentro del cristal (sin bloom ni deslumbramiento cegador) -->
            <image id="right-lens-scene-park" 
                   href="./scenes/parque-familiar.jpg" 
                   x="-80" y="-60" width="2080" height="1200" 
                   preserveAspectRatio="xMidYMid slice" 
                   style="opacity: ${isPark ? '1' : '0'}; filter: brightness(0.82) contrast(1.20) saturate(1.22); transition: opacity 200ms ease-in-out, filter 0.2s linear;" />

            <!-- Escena Museo de Arte dentro del cristal (sin focos molestos) -->
            <image id="right-lens-scene-museum" 
                   href="./scenes/museo-arte.jpg" 
                   x="-80" y="-60" width="2080" height="1200" 
                   preserveAspectRatio="xMidYMid slice" 
                   style="opacity: ${isPark ? '0' : '1'}; filter: brightness(0.84) contrast(1.18) saturate(1.15); transition: opacity 200ms ease-in-out, filter 0.2s linear;" />
            
            <!-- Capa de Tinte Fotosensible Primario Transitions (Multiply suave con color auténtico) -->
            <rect id="right-lens-tint" x="0" y="0" width="1920" height="1080" 
                  fill="rgb(110, 45, 190)" 
                  style="mix-blend-mode: multiply; opacity: 0.14; transition: opacity 0.15s linear, fill 0.35s ease;" />
            
            <!-- Capa de Efecto Espejo Flash (Style Mirrors) -->
            <rect id="right-lens-mirror" x="0" y="0" width="1920" height="1080" 
                  fill="url(#mirrorSheenGrad)" 
                  style="mix-blend-mode: overlay; opacity: 0; transition: opacity 0.3s ease;" />

            <!-- Reflejo Crizal Antirreflejo en Esquina Superior del Cristal -->
            <ellipse cx="1380" cy="330" rx="220" ry="25" transform="rotate(10 1380 330)" 
                     fill="rgba(255,255,255,0.08)" style="mix-blend-mode: screen;" />
          </g>

          <!-- 2. MONTURA OFTÁLMICA VECTORIAL PREMIUM (POV) -->
          <g id="glasses-frame-svg-group" filter="url(#frame-drop-shadow)">
            
            <!-- Patilla Izquierda extendiéndose hacia la periferia -->
            <path d="M 0 320 
                     C 100 315, 170 310, 220 315
                     L 230 365
                     C 170 355, 90 360, 0 375 Z" 
                  fill="url(#acetateGradient)" filter="url(#frame-dof-blur)" />
            
            <!-- Patilla Derecha extendiéndose hacia la periferia -->
            <path d="M 1920 320 
                     C 1820 315, 1750 310, 1700 315
                     L 1690 365
                     C 1750 355, 1830 360, 1920 375 Z" 
                  fill="url(#acetateGradient)" filter="url(#frame-dof-blur)" />

            <!-- Remaches clásicos de metal -->
            <circle cx="210" cy="325" r="3" fill="#CBD5E1" opacity="0.9" />
            <circle cx="218" cy="325" r="3" fill="#CBD5E1" opacity="0.9" />
            <circle cx="1702" cy="325" r="3" fill="#CBD5E1" opacity="0.9" />
            <circle cx="1710" cy="325" r="3" fill="#CBD5E1" opacity="0.9" />

            <!-- Cuerpo Completo del Marco Frontal (Puente sutil y orificios binoculares) -->
            <path d="
              /* Silueta Exterior del Marco Panorámico */
              M 180 270
              C 480 230, 830 240, 945 340
              C 955 350, 965 350, 975 340
              C 1090 240, 1440 230, 1740 270
              C 1800 340, 1810 500, 1750 750
              C 1600 870, 1140 880, 980 770
              C 970 755, 950 755, 940 770
              C 780 880, 320 870, 170 750
              C 110 500, 120 340, 180 270 Z

              /* Agujero Lente Izquierdo */
              M 230 290
              C 170 420, 190 680, 260 760
              C 420 830, 760 840, 880 770
              C 940 700, 955 450, 935 340
              C 800 260, 480 250, 230 290 Z

              /* Agujero Lente Derecho */
              M 985 340
              C 965 450, 980 700, 1040 770
              C 1160 840, 1500 830, 1660 760
              C 1730 680, 1750 420, 1690 290
              C 1440 250, 1120 260, 985 340 Z
            "
            fill="url(#acetateGradient)"
            fill-rule="evenodd"
            stroke="#1E293B"
            stroke-width="3"
            filter="url(#frame-dof-blur)" />

            <!-- Reflejo Superior de Luz en el Borde del Marco -->
            <path d="M 190 275 C 480 235, 825 245, 940 342" 
                  fill="none" stroke="rgba(255, 255, 255, 0.28)" stroke-width="2" />
            <path d="M 980 342 C 1095 245, 1440 235, 1730 275" 
                  fill="none" stroke="rgba(255, 255, 255, 0.28)" stroke-width="2" />

            <!-- Biseles internos facetados de los cristales -->
            <path d="M 230 290 C 480 250, 800 260, 935 340 C 955 450, 940 700, 880 770 C 760 840, 420 830, 260 760 C 190 680, 170 420, 230 290 Z" 
                  fill="none" stroke="url(#facetBevelGrad)" stroke-width="1.8" />
            
            <path d="M 985 340 C 1120 260, 1440 250, 1690 290 C 1750 420, 1730 680, 1660 760 C 1500 830, 1160 840, 1040 770 C 980 700, 965 450, 985 340 Z" 
                  fill="none" stroke="url(#facetBevelGrad)" stroke-width="1.8" />
          </g>

        </g>
      </svg>
    `;

    this.container.appendChild(this.element);

    this.masterGroup = this.element.querySelector('#glasses-pov-master-group');
    const leftScenePark = this.element.querySelector('#left-lens-scene-park');
    const leftSceneMuseum = this.element.querySelector('#left-lens-scene-museum');
    const rightScenePark = this.element.querySelector('#right-lens-scene-park');
    const rightSceneMuseum = this.element.querySelector('#right-lens-scene-museum');
    this.allSceneImages = [leftScenePark, leftSceneMuseum, rightScenePark, rightSceneMuseum];
  }

  bindEvents() {
    const leftScenePark = this.element.querySelector('#left-lens-scene-park');
    const leftSceneMuseum = this.element.querySelector('#left-lens-scene-museum');
    const rightScenePark = this.element.querySelector('#right-lens-scene-park');
    const rightSceneMuseum = this.element.querySelector('#right-lens-scene-museum');

    const leftTint = this.element.querySelector('#left-lens-tint');
    const rightTint = this.element.querySelector('#right-lens-tint');
    const leftMirror = this.element.querySelector('#left-lens-mirror');
    const rightMirror = this.element.querySelector('#right-lens-mirror');

    // Transición sincronizada de 200ms al cambiar de escena
    eventBus.on('scene:change', ({ sceneId }) => {
      const isPark = sceneId === 'park';
      if (leftScenePark) leftScenePark.style.opacity = isPark ? '1' : '0';
      if (leftSceneMuseum) leftSceneMuseum.style.opacity = isPark ? '0' : '1';
      if (rightScenePark) rightScenePark.style.opacity = isPark ? '1' : '0';
      if (rightSceneMuseum) rightSceneMuseum.style.opacity = isPark ? '0' : '1';
    });

    // Actualización Cinética Continua en Tiempo Real
    eventBus.on('kinetic:update', ({ absorption, lens }) => {
      if (!lens) return;

      // 1. Filtrado óptico sin deslumbramiento: Brillo descansado (0.70 a 0.86), contraste y saturación enriquecidos
      const brightness = Math.max(0.68, 0.90 - (absorption * 0.22));
      const contrast = 1.15 + (absorption * 0.15);
      const saturate = 1.15 + (absorption * 0.18);
      const filterCss = `brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(2)}) saturate(${saturate.toFixed(2)})`;
      
      this.allSceneImages.forEach(img => {
        if (img) img.style.filter = filterCss;
      });

      // 2. Tinte cromático fotosensible suave (multiply translúcido)
      const [r, g, b] = lens.tintRgb;
      const tintFill = `rgb(${r}, ${g}, ${b})`;
      if (leftTint) leftTint.setAttribute('fill', tintFill);
      if (rightTint) rightTint.setAttribute('fill', tintFill);
      
      const tintOpacity = Math.max(0.10, Math.min(0.58, absorption * 0.62));
      if (leftTint) leftTint.style.opacity = tintOpacity.toFixed(2);
      if (rightTint) rightTint.style.opacity = tintOpacity.toFixed(2);

      // 3. Efecto espejo (Style Mirrors)
      if (lens.mirrorEffect) {
        const mirrorOpacity = Math.min(0.48, absorption * 0.52);
        if (leftMirror) leftMirror.style.opacity = mirrorOpacity.toFixed(2);
        if (rightMirror) rightMirror.style.opacity = mirrorOpacity.toFixed(2);
      } else {
        if (leftMirror) leftMirror.style.opacity = '0';
        if (rightMirror) rightMirror.style.opacity = '0';
      }
    });

    // Filtro para ignorar toques/clics sobre botones o tarjetas interactivas
    const isInteractiveUI = (target) => {
      if (!target || !target.closest) return false;
      return !!target.closest('button, input, a, .lens-selector-card, .brand-badge, .hud-actions-right, .avatar-widget-card, .landing-overlay, .btn-recenter-pill');
    };

    // Control de mirada 100% a voluntad del paciente (Arrastrar intencionalmente)
    this.element.addEventListener('pointerdown', (e) => {
      if (simulatorState.screen !== 'experience') return;
      if (isInteractiveUI(e.target)) return;

      this.isDragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.element.classList.add('is-dragging');
      this.hideHintPill();

      try {
        this.element.setPointerCapture(e.pointerId);
      } catch {}
    });

    this.element.addEventListener('pointermove', (e) => {
      if (simulatorState.screen !== 'experience' || !this.isDragging) return;

      const deltaX = (e.clientX - this.startX) / (window.innerWidth * 0.38);
      const deltaY = (e.clientY - this.startY) / (window.innerHeight * 0.38);
      this.startX = e.clientX;
      this.startY = e.clientY;

      // Actualizar posición de mirada deseada por el paciente
      this.targetGazeX = Math.max(-1, Math.min(1, this.targetGazeX + deltaX));
      this.targetGazeY = Math.max(-1, Math.min(1, this.targetGazeY + deltaY));
    });

    const onPointerEnd = (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        this.element.classList.remove('is-dragging');
        try {
          this.element.releasePointerCapture(e.pointerId);
        } catch {}
      }
    };

    this.element.addEventListener('pointerup', onPointerEnd);
    this.element.addEventListener('pointercancel', onPointerEnd);

    // Doble clic para centrar la mirada de inmediato
    this.element.addEventListener('dblclick', (e) => {
      if (isInteractiveUI(e.target)) return;
      this.targetGazeX = 0;
      this.targetGazeY = 0;
    });

    // Botón flotante para recentrar la mirada
    const recenterBtn = this.element.querySelector('#btn-recenter-gaze');
    if (recenterBtn) {
      recenterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.targetGazeX = 0;
        this.targetGazeY = 0;
      });
    }

    // Ocultar hint pill automáticamente tras 6 segundos
    setTimeout(() => {
      this.hideHintPill();
    }, 6000);
  }

  hideHintPill() {
    if (this.hintDismissed) return;
    this.hintDismissed = true;
    const pill = this.element.querySelector('#pov-gaze-hint');
    if (pill) {
      pill.classList.add('hint-hidden');
    }
  }

  /**
   * Bucle a 60 FPS con interpolación cinemática suave para la mirada del paciente:
   * Solo se mueve cuando el paciente arrastra la vista a voluntad.
   */
  startGazeLoop() {
    const recenterBtn = this.element.querySelector('#btn-recenter-gaze');

    const loop = () => {
      if (simulatorState.screen === 'experience') {
        // Interpolación amortiguada continua (lerp)
        this.currentGazeX += (this.targetGazeX - this.currentGazeX) * 0.08;
        this.currentGazeY += (this.targetGazeY - this.currentGazeY) * 0.08;

        // Mostrar u ocultar botón de recentrado según el desplazamiento
        if (recenterBtn) {
          const isDisplaced = Math.abs(this.currentGazeX) > 0.16 || Math.abs(this.currentGazeY) > 0.16;
          recenterBtn.classList.toggle('visible', isDisplaced);
        }

        // Emitir posición de mirada para sincronizar el fondo panorámico
        eventBus.emit('gaze:update', {
          gazeX: this.currentGazeX,
          gazeY: this.currentGazeY
        });

        // Articular las gafas en primera persona:
        // Cuando el paciente mira arriba (gazeY < 0), la línea de vista se eleva por encima del marco (glassesOffsetY > 0)
        // para mirar directamente por encima de las gafas a voluntad.
        const glassesOffsetY = -this.currentGazeY * 115;
        const glassesOffsetX = this.currentGazeX * 45;
        const glassesRotate = this.currentGazeX * 1.6;

        if (this.masterGroup) {
          this.masterGroup.setAttribute(
            'transform',
            `translate(${glassesOffsetX.toFixed(1)}, ${glassesOffsetY.toFixed(1)}) rotate(${glassesRotate.toFixed(1)} 960 540)`
          );
        }

        // Sincronizar las imágenes dentro de los cristales para que coincidan con las coordenadas del mundo
        const imgOffsetX = (-this.currentGazeX * 85 - glassesOffsetX) * 0.72;
        const imgOffsetY = (-this.currentGazeY * 60 - glassesOffsetY) * 0.72;

        this.allSceneImages.forEach(img => {
          if (img) {
            img.setAttribute('transform', `translate(${imgOffsetX.toFixed(1)}, ${imgOffsetY.toFixed(1)})`);
          }
        });
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

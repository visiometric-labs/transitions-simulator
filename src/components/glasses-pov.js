import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';

export class GlassesPOV {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.currentLens = simulatorState.getCurrentLens();
    this.currentScene = simulatorState.getCurrentScene();
    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'glasses-pov-layer';

    // SVG 1920x1080 con apertura binocular panorámica natural y puente estilizado de 50px
    this.element.innerHTML = `
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
        <!-- 1. CAPAS DE CRISTALES ÓPTICOS FILTRADOS (IZQ + DER) -->
        <!-- ============================================== -->
        
        <!-- Lente Izquierdo -->
        <g clip-path="url(#left-lens-clip)">
          <!-- Imagen de Escena con Filtro Óptico (Brillo atenuado confortable, nunca negro) -->
          <image id="left-lens-scene-img" 
                 href="${this.currentScene.bgImage}" 
                 x="0" y="0" width="1920" height="1080" 
                 preserveAspectRatio="xMidYMid slice" 
                 style="filter: brightness(0.92) contrast(1.05) saturate(1.10); transition: filter 0.2s linear;" />
          
          <!-- Capa de Tinte Fotosensible Primario (Multiply suave con color real) -->
          <rect id="left-lens-tint" x="0" y="0" width="1920" height="1080" 
                fill="rgb(110, 45, 190)" 
                style="mix-blend-mode: multiply; opacity: 0.12; transition: opacity 0.15s linear, fill 0.35s ease;" />
          
          <!-- Capa de Efecto Espejo Flash (Style Mirrors) -->
          <rect id="left-lens-mirror" x="0" y="0" width="1920" height="1080" 
                fill="url(#mirrorSheenGrad)" 
                style="mix-blend-mode: overlay; opacity: 0; transition: opacity 0.3s ease;" />

          <!-- Reflejo Crizal Antirreflejo en Esquina Superior del Cristal -->
          <ellipse cx="540" cy="330" rx="220" ry="25" transform="rotate(-10 540 330)" 
                   fill="rgba(255,255,255,0.09)" style="mix-blend-mode: screen;" />
        </g>

        <!-- Lente Derecho -->
        <g clip-path="url(#right-lens-clip)">
          <!-- Imagen de Escena con Filtro Óptico (Brillo atenuado confortable, nunca negro) -->
          <image id="right-lens-scene-img" 
                 href="${this.currentScene.bgImage}" 
                 x="0" y="0" width="1920" height="1080" 
                 preserveAspectRatio="xMidYMid slice" 
                 style="filter: brightness(0.92) contrast(1.05) saturate(1.10); transition: filter 0.2s linear;" />
          
          <!-- Capa de Tinte Fotosensible Primario (Multiply suave con color real) -->
          <rect id="right-lens-tint" x="0" y="0" width="1920" height="1080" 
                fill="rgb(110, 45, 190)" 
                style="mix-blend-mode: multiply; opacity: 0.12; transition: opacity 0.15s linear, fill 0.35s ease;" />
          
          <!-- Capa de Efecto Espejo Flash (Style Mirrors) -->
          <rect id="right-lens-mirror" x="0" y="0" width="1920" height="1080" 
                fill="url(#mirrorSheenGrad)" 
                style="mix-blend-mode: overlay; opacity: 0; transition: opacity 0.3s ease;" />

          <!-- Reflejo Crizal Antirreflejo en Esquina Superior del Cristal -->
          <ellipse cx="1380" cy="330" rx="220" ry="25" transform="rotate(10 1380 330)" 
                   fill="rgba(255,255,255,0.09)" style="mix-blend-mode: screen;" />
        </g>

        <!-- ============================================== -->
        <!-- 2. MONTURA OFTÁLMICA VECTORIAL PREMIUM (POV)   -->
        <!-- ============================================== -->
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

          <!-- Cuerpo Completo del Marco Frontal (Puente sutil de 50px y orificios binoculares) -->
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
      </svg>
    `;

    this.container.appendChild(this.element);
  }

  bindEvents() {
    const leftSceneImg = this.element.querySelector('#left-lens-scene-img');
    const rightSceneImg = this.element.querySelector('#right-lens-scene-img');
    const leftTint = this.element.querySelector('#left-lens-tint');
    const rightTint = this.element.querySelector('#right-lens-tint');
    const leftMirror = this.element.querySelector('#left-lens-mirror');
    const rightMirror = this.element.querySelector('#right-lens-mirror');

    // Actualización de Escena (sincronizar imagen interior)
    eventBus.on('scene:change', ({ scene }) => {
      this.currentScene = scene;
      leftSceneImg.setAttribute('href', scene.bgImage);
      rightSceneImg.setAttribute('href', scene.bgImage);
    });

    // Actualización Cinética Continua en Tiempo Real
    eventBus.on('kinetic:update', ({ absorption, lens }) => {
      if (!lens) return;

      // 1. Filtrado óptico fotorrealista (Atenuación confortable de luminosidad: 0.74 a 0.95, NUNCA negro)
      const brightness = Math.max(0.72, 1.0 - (absorption * 0.28));
      const contrast = 1.0 + (absorption * 0.15);
      const saturate = 1.0 + (absorption * 0.20);
      const filterCss = `brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(2)}) saturate(${saturate.toFixed(2)})`;
      
      leftSceneImg.style.filter = filterCss;
      rightSceneImg.style.filter = filterCss;

      // 2. Tinte cromático fotosensible suave (multiply translúcido que conserva 100% de los detalles)
      const [r, g, b] = lens.tintRgb;
      const tintFill = `rgb(${r}, ${g}, ${b})`;
      leftTint.setAttribute('fill', tintFill);
      rightTint.setAttribute('fill', tintFill);
      
      const tintOpacity = Math.max(0.08, Math.min(0.48, absorption * 0.52));
      leftTint.style.opacity = tintOpacity.toFixed(2);
      rightTint.style.opacity = tintOpacity.toFixed(2);

      // 3. Efecto espejo (Style Mirrors)
      if (lens.mirrorEffect) {
        const mirrorOpacity = Math.min(0.45, absorption * 0.50);
        leftMirror.style.opacity = mirrorOpacity.toFixed(2);
        rightMirror.style.opacity = mirrorOpacity.toFixed(2);
      } else {
        leftMirror.style.opacity = '0';
        rightMirror.style.opacity = '0';
      }
    });

    // Micro-paralaje sutil en primera persona al mover el cursor
    window.addEventListener('mousemove', (e) => {
      if (simulatorState.screen !== 'experience') return;
      const offsetX = (e.clientX / window.innerWidth - 0.5) * 12;
      const offsetY = (e.clientY / window.innerHeight - 0.5) * 8;
      const frameGroup = this.element.querySelector('#glasses-frame-svg-group');
      if (frameGroup) {
        frameGroup.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        frameGroup.style.transition = 'transform 0.1s ease-out';
      }
    }, { passive: true });
  }
}

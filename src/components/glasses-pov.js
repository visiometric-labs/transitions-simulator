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

    // SVG 1920x1080 Full HD con máscaras de recorte para los dos cristales ópticos independientes
    this.element.innerHTML = `
      <svg id="glasses-pov-svg" width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Máscara Lente Izquierdo -->
          <clipPath id="left-lens-clip">
            <path d="M 430 350
                     C 630 320, 840 330, 895 380
                     C 915 470, 890 640, 855 680
                     C 790 750, 520 740, 425 675
                     C 385 620, 375 440, 430 350 Z" />
          </clipPath>

          <!-- Máscara Lente Derecho -->
          <clipPath id="right-lens-clip">
            <path d="M 1025 380
                     C 1080 330, 1290 320, 1490 350
                     C 1545 440, 1535 620, 1495 675
                     C 1400 740, 1130 750, 1065 680
                     C 1030 640, 1005 470, 1025 380 Z" />
          </clipPath>

          <!-- Filtro de Desenfoque Fisiológico Leve en el Marco cercano (DoF) -->
          <filter id="frame-dof-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>

          <!-- Sombra Suave de Oclusión del Marco -->
          <filter id="frame-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
            <feOffset dx="0" dy="6" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.45" />
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
            <stop offset="35%" stop-color="rgba(56,189,248,0.3)" />
            <stop offset="70%" stop-color="rgba(255,255,255,0.05)" />
            <stop offset="100%" stop-color="rgba(56,189,248,0.4)" />
          </linearGradient>
        </defs>

        <!-- ============================================== -->
        <!-- 1. CAPAS DE CRISTALES ÓPTICOS FILTRADOS (IZQ + DER) -->
        <!-- ============================================== -->
        
        <!-- Lente Izquierdo -->
        <g clip-path="url(#left-lens-clip)">
          <!-- Imagen de Escena con Filtro Óptico / Absorción Solar -->
          <image id="left-lens-scene-img" 
                 href="${this.currentScene.bgImage}" 
                 x="0" y="0" width="1920" height="1080" 
                 preserveAspectRatio="xMidYMid slice" />
          
          <!-- Capa de Tinte Fotosensible Primario (Multiply) -->
          <rect id="left-lens-tint" x="0" y="0" width="1920" height="1080" 
                fill="rgb(110, 45, 190)" 
                style="mix-blend-mode: multiply; opacity: 0.15; transition: opacity 0.12s linear, fill 0.35s ease;" />
          
          <!-- Capa de Densidad Solar Neutral (Oscurecimiento) -->
          <rect id="left-lens-density" x="0" y="0" width="1920" height="1080" 
                fill="#050811" 
                style="opacity: 0.10; transition: opacity 0.12s linear;" />
          
          <!-- Capa de Efecto Espejo Flash (Style Mirrors) -->
          <rect id="left-lens-mirror" x="0" y="0" width="1920" height="1080" 
                fill="url(#mirrorSheenGrad)" 
                style="mix-blend-mode: overlay; opacity: 0; transition: opacity 0.3s ease;" />

          <!-- Reflejo Crizal Antirreflejo en Esquina Superior del Cristal -->
          <ellipse cx="640" cy="380" rx="180" ry="25" transform="rotate(-12 640 380)" 
                   fill="rgba(255,255,255,0.08)" style="mix-blend-mode: screen;" />
        </g>

        <!-- Lente Derecho -->
        <g clip-path="url(#right-lens-clip)">
          <!-- Imagen de Escena con Filtro Óptico / Absorción Solar -->
          <image id="right-lens-scene-img" 
                 href="${this.currentScene.bgImage}" 
                 x="0" y="0" width="1920" height="1080" 
                 preserveAspectRatio="xMidYMid slice" />
          
          <!-- Capa de Tinte Fotosensible Primario (Multiply) -->
          <rect id="right-lens-tint" x="0" y="0" width="1920" height="1080" 
                fill="rgb(110, 45, 190)" 
                style="mix-blend-mode: multiply; opacity: 0.15; transition: opacity 0.12s linear, fill 0.35s ease;" />
          
          <!-- Capa de Densidad Solar Neutral (Oscurecimiento) -->
          <rect id="right-lens-density" x="0" y="0" width="1920" height="1080" 
                fill="#050811" 
                style="opacity: 0.10; transition: opacity 0.12s linear;" />
          
          <!-- Capa de Efecto Espejo Flash (Style Mirrors) -->
          <rect id="right-lens-mirror" x="0" y="0" width="1920" height="1080" 
                fill="url(#mirrorSheenGrad)" 
                style="mix-blend-mode: overlay; opacity: 0; transition: opacity 0.3s ease;" />

          <!-- Reflejo Crizal Antirreflejo en Esquina Superior del Cristal -->
          <ellipse cx="1280" cy="380" rx="180" ry="25" transform="rotate(12 1280 380)" 
                   fill="rgba(255,255,255,0.08)" style="mix-blend-mode: screen;" />
        </g>

        <!-- ============================================== -->
        <!-- 2. MONTURA OFTÁLMICA VECTORIAL PREMIUM (POV)   -->
        <!-- ============================================== -->
        <g id="glasses-frame-svg-group" filter="url(#frame-drop-shadow)">
          
          <!-- Patilla Izquierda extendiéndose hacia fuera de pantalla -->
          <path d="M 0 380 
                   C 200 375, 340 370, 400 375
                   L 410 425
                   C 340 415, 180 420, 0 435 Z" 
                fill="url(#acetateGradient)" filter="url(#frame-dof-blur)" />
          
          <!-- Patilla Derecha extendiéndose hacia fuera de pantalla -->
          <path d="M 1920 380 
                   C 1720 375, 1580 370, 1520 375
                   L 1510 425
                   C 1580 415, 1740 420, 1920 435 Z" 
                fill="url(#acetateGradient)" filter="url(#frame-dof-blur)" />

          <!-- Bisagras de Metal / Remaches Clásicos -->
          <circle cx="390" cy="380" r="3.5" fill="#CBD5E1" opacity="0.9" />
          <circle cx="400" cy="380" r="3.5" fill="#CBD5E1" opacity="0.9" />
          <circle cx="1520" cy="380" r="3.5" fill="#CBD5E1" opacity="0.9" />
          <circle cx="1530" cy="380" r="3.5" fill="#CBD5E1" opacity="0.9" />

          <!-- Cuerpo Completo del Marco Frontal (Acetato Negro) -->
          <path d="
            /* Borde Exterior del Marco */
            M 360 330
            C 630 300, 880 310, 940 395
            C 955 410, 965 410, 980 395
            C 1040 310, 1290 300, 1560 330
            C 1610 370, 1615 480, 1560 670
            C 1470 780, 1100 800, 990 680
            C 975 660, 945 660, 930 680
            C 820 800, 450 780, 360 670
            C 305 480, 310 370, 360 330 Z

            /* Agujero Lente Izquierdo (Hole Cutout) */
            M 430 350
            C 375 440, 385 620, 425 675
            C 520 740, 790 750, 855 680
            C 890 640, 915 470, 895 380
            C 840 330, 630 320, 430 350 Z

            /* Agujero Lente Derecho (Hole Cutout) */
            M 1025 380
            C 1005 470, 1030 640, 1065 680
            C 1130 750, 1400 740, 1495 675
            C 1535 620, 1545 440, 1490 350
            C 1290 320, 1080 330, 1025 380 Z
          "
          fill="url(#acetateGradient)"
          fill-rule="evenodd"
          stroke="#1E293B"
          stroke-width="3"
          filter="url(#frame-dof-blur)" />

          <!-- Biseles y Reflejos de Luz en el Borde Superior del Marco -->
          <path d="M 370 335 C 630 305, 875 315, 935 395" 
                fill="none" stroke="rgba(255, 255, 255, 0.28)" stroke-width="2" />
          <path d="M 985 395 C 1045 315, 1290 305, 1550 335" 
                fill="none" stroke="rgba(255, 255, 255, 0.28)" stroke-width="2" />

          <!-- Bisel interno facetado de los cristales -->
          <path d="M 430 350 C 630 320, 840 330, 895 380 C 915 470, 890 640, 855 680 C 790 750, 520 740, 425 675 C 385 620, 375 440, 430 350 Z" 
                fill="none" stroke="url(#facetBevelGrad)" stroke-width="1.8" />
          
          <path d="M 1025 380 C 1080 330, 1290 320, 1490 350 C 1545 440, 1535 620, 1495 675 C 1400 740, 1130 750, 1065 680 C 1030 640, 1005 470, 1025 380 Z" 
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
    const leftDensity = this.element.querySelector('#left-lens-density');
    const rightDensity = this.element.querySelector('#right-lens-density');
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

      const [r, g, b] = lens.tintRgb;
      const tintFill = `rgb(${r}, ${g}, ${b})`;

      // 1. Tinte cromático con modo multiply
      leftTint.setAttribute('fill', tintFill);
      rightTint.setAttribute('fill', tintFill);
      const tintOpacity = Math.min(0.85, absorption * 0.95);
      leftTint.style.opacity = tintOpacity.toFixed(2);
      rightTint.style.opacity = tintOpacity.toFixed(2);

      // 2. Densidad solar neutra (bloqueo fotópico)
      const densityOpacity = Math.max(0.05, (absorption - 0.15) * 0.9);
      leftDensity.style.opacity = densityOpacity.toFixed(2);
      rightDensity.style.opacity = densityOpacity.toFixed(2);

      // 3. Efecto espejo (Style Mirrors)
      if (lens.mirrorEffect) {
        const mirrorOpacity = Math.min(0.70, absorption * 0.85);
        leftMirror.style.opacity = mirrorOpacity.toFixed(2);
        rightMirror.style.opacity = mirrorOpacity.toFixed(2);
      } else {
        leftMirror.style.opacity = '0';
        rightMirror.style.opacity = '0';
      }
    });

    // Micro-paralaje sutil en primera persona al mover el cursor
    window.addEventListener('mousemove', (e) => {
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

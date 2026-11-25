import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';

export class AvatarWidget {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.currentReaction = 'idle';
    this.blinkTimer = null;
    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('div');
    this.element.id = 'avatar-widget';
    this.element.className = 'avatar-widget-card';
    this.element.title = '¡Tócame para interactuar! (Mini-Espejo reactivo)';

    this.element.innerHTML = `
      <!-- Badge de Estado En Vivo -->
      <div class="avatar-badge-status">
        <span class="avatar-badge-dot"></span>
        <span>EN VIVO</span>
      </div>

      <!-- Escenario del Avatar Vivo (Estilo My Talking Cat) -->
      <div class="avatar-stage">
        <div id="avatar-living-body" class="avatar-living-body">
          
          <!-- 1. Imagen Idle / Sonrisa Atenta (Fondo Transparente) -->
          <img id="avatar-img-idle" class="avatar-portrait-img" src="./avatar/avatar-hero.png" alt="Avatar Luminix Idle" style="opacity: 1;" />

          <!-- 2. Imagen Clapping / Aplauso de Celebración (Fondo Transparente) -->
          <img id="avatar-img-clapping" class="avatar-portrait-img" src="./avatar/avatar-clapping.png" alt="Avatar Luminix Reacción" style="opacity: 0;" />

          <!-- 3. Párpados de pestañeo natural continuo -->
          <div id="avatar-blink-box" class="avatar-blink-overlay">
            <div class="eyelid-shape"></div>
            <div class="eyelid-shape"></div>
          </div>

          <!-- 4. SVG de Tinte EXCLUSIVO sobre los Cristales de las Gafas (NO la cara ni la ropa) -->
          <svg class="avatar-spectacles-tint-layer" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="avatar-spectacle-lenses-clip">
                <!-- Lente Izquierdo del Avatar -->
                <ellipse cx="418" cy="445" rx="72" ry="54" />
                <!-- Lente Derecho del Avatar -->
                <ellipse cx="612" cy="445" rx="72" ry="54" />
              </clipPath>
              
              <!-- Degradado Espejado Flash para Style Mirrors -->
              <linearGradient id="avatarMirrorGrad" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stop-color="rgba(255,255,255,0.7)" />
                <stop offset="40%" stop-color="rgba(56,189,248,0.4)" />
                <stop offset="70%" stop-color="rgba(255,255,255,0.1)" />
                <stop offset="100%" stop-color="rgba(56,189,248,0.4)" />
              </linearGradient>
            </defs>

            <!-- Grupo recortado estrictamente al área de los cristales -->
            <g clip-path="url(#avatar-spectacle-lenses-clip)">
              <!-- Capa de Tinte Fotosensible de la Tecnología Activa -->
              <rect id="widget-lens-tint" x="0" y="0" width="1024" height="1024" 
                    fill="rgb(110, 45, 190)" 
                    style="mix-blend-mode: multiply; opacity: 0.15; transition: opacity 0.25s linear, fill 0.35s ease;" />
              
              <!-- Capa Espejada (Style Mirrors) -->
              <rect id="widget-lens-mirror" x="0" y="0" width="1024" height="1024" 
                    fill="url(#avatarMirrorGrad)" 
                    style="mix-blend-mode: overlay; opacity: 0; transition: opacity 0.3s ease;" />

              <!-- Reflejo óptico antireflejo en esquina del lente -->
              <ellipse cx="430" cy="425" rx="35" ry="8" transform="rotate(-15 430 425)" fill="rgba(255,255,255,0.18)" style="mix-blend-mode: screen;" />
              <ellipse cx="625" cy="425" rx="35" ry="8" transform="rotate(15 625 425)" fill="rgba(255,255,255,0.18)" style="mix-blend-mode: screen;" />
            </g>
          </svg>

        </div>
      </div>
    `;

    this.container.appendChild(this.element);
    this.startBlinkLoop();
  }

  startBlinkLoop() {
    const doBlink = () => {
      const blinkBox = this.element.querySelector('#avatar-blink-box');
      if (blinkBox) {
        blinkBox.classList.add('avatar-blinking');
        setTimeout(() => {
          blinkBox.classList.remove('avatar-blinking');
        }, 180);
      }
      // Intervalo aleatorio fisiológico entre 3.0s y 5.5s
      const nextDelay = 3000 + Math.random() * 2500;
      this.blinkTimer = setTimeout(doBlink, nextDelay);
    };

    this.blinkTimer = setTimeout(doBlink, 3500);
  }

  bindEvents() {
    const idleImg = this.element.querySelector('#avatar-img-idle');
    const clappingImg = this.element.querySelector('#avatar-img-clapping');
    const lensTint = this.element.querySelector('#widget-lens-tint');
    const lensMirror = this.element.querySelector('#widget-lens-mirror');
    const livingBody = this.element.querySelector('#avatar-living-body');

    // Clic en el avatar para provocar reacción de aplauso/asombro e interacción
    this.element.addEventListener('click', () => {
      this.playPokeAudio();
      simulatorState.triggerAvatarReaction('clapping');
    });

    // Micro-seguimiento de mirada estilo "Talking Cat" con el ratón
    window.addEventListener('mousemove', (e) => {
      if (simulatorState.screen !== 'experience') return;
      const rect = this.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / window.innerWidth;
      const deltaY = (e.clientY - centerY) / window.innerHeight;

      const rotY = Math.max(-10, Math.min(10, deltaX * 18));
      const rotX = Math.max(-8, Math.min(8, -deltaY * 14));

      livingBody.style.transform = `perspective(500px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    }, { passive: true });

    // Actualización de reacción del avatar (aplausos al cambiar lente o escena)
    eventBus.on('avatar:reaction', ({ type }) => {
      this.currentReaction = type;
      if (type === 'clapping') {
        idleImg.style.opacity = '0';
        clappingImg.style.opacity = '1';
        clappingImg.style.transform = 'scale(1.05)';
      } else {
        idleImg.style.opacity = '1';
        clappingImg.style.opacity = '0';
        clappingImg.style.transform = 'scale(1)';
      }
    });

    // Sincronización cinética ÚNICAMENTE sobre los cristales de las gafas
    eventBus.on('kinetic:update', ({ absorption, lens }) => {
      if (!lens) return;

      const [r, g, b] = lens.tintRgb;
      lensTint.setAttribute('fill', `rgb(${r}, ${g}, ${b})`);
      
      // La opacidad del tinte varía entre 0.10 y 0.75 según la absorción solar
      const tintOpacity = Math.max(0.08, Math.min(0.78, absorption * 0.85));
      lensTint.style.opacity = tintOpacity.toFixed(2);

      // Efecto espejo si aplica
      if (lens.mirrorEffect) {
        lensMirror.style.opacity = (absorption * 0.60).toFixed(2);
      } else {
        lensMirror.style.opacity = '0';
      }
    });
  }

  playPokeAudio() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, audioCtx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(620, audioCtx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.30);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.31);
    } catch {}
  }
}

import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';

export class AvatarWidget {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.currentReaction = 'idle'; // 'idle' | 'clapping'
    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('div');
    this.element.id = 'avatar-widget';
    this.element.className = 'avatar-widget-card';
    this.element.title = 'Vista previa en tiempo real sobre el paciente (Mini-Espejo)';

    this.element.innerHTML = `
      <!-- Badge de Estado En Vivo -->
      <div class="avatar-badge-status">
        <span class="avatar-badge-dot"></span>
        <span>EN VIVO</span>
      </div>

      <!-- Imagen Idle / Sonrisa -->
      <img id="avatar-img-idle" class="avatar-portrait-img" src="./avatar/avatar-hero.jpg" alt="Avatar Luminix Idle" style="opacity: 1;" />

      <!-- Imagen Clapping / Aplauso de Celebración -->
      <img id="avatar-img-clapping" class="avatar-portrait-img" src="./avatar/avatar-clapping.jpg" alt="Avatar Luminix Reacción" style="opacity: 0;" />

      <!-- Capa de Tinte Dinámico sobre las Lentes del Avatar -->
      <div id="avatar-lens-tint" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; mix-blend-mode: multiply; opacity: 0; transition: opacity 0.25s linear, background-color 0.4s ease;"></div>
    `;

    this.container.appendChild(this.element);
  }

  bindEvents() {
    const idleImg = this.element.querySelector('#avatar-img-idle');
    const clappingImg = this.element.querySelector('#avatar-img-clapping');
    const lensTint = this.element.querySelector('#avatar-lens-tint');

    // Click en el avatar para provocar reacción de aplauso/asombro
    this.element.addEventListener('click', () => {
      simulatorState.triggerAvatarReaction('clapping');
    });

    // Actualización de reacción del avatar
    eventBus.on('avatar:reaction', ({ type }) => {
      this.currentReaction = type;
      if (type === 'clapping') {
        idleImg.style.opacity = '0';
        clappingImg.style.opacity = '1';
        clappingImg.style.transform = 'scale(1.04)';
      } else {
        idleImg.style.opacity = '1';
        clappingImg.style.opacity = '0';
        clappingImg.style.transform = 'scale(1)';
      }
    });

    // Sincronización cinética del tintado con la lente activa
    eventBus.on('kinetic:update', ({ absorption, lens }) => {
      if (!lens) return;

      // El tinte en las gafas del avatar varía en concordancia exacta
      const [r, g, b] = lens.tintRgb;
      lensTint.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      lensTint.style.opacity = (absorption * 0.75).toFixed(2);
    });
  }
}

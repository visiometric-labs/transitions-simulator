import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';
import { Avatar3DEngine } from '../core/avatar-3d-engine.js';

export class AvatarWidget {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.avatar3D = null;
    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('div');
    this.element.id = 'avatar-widget';
    this.element.className = 'avatar-widget-card';
    this.element.title = '¡Tócame para interactuar! (Avatar 3D en tiempo real)';

    this.element.innerHTML = `
      <!-- Badge de Estado En Vivo -->
      <div class="avatar-badge-status">
        <span class="avatar-badge-dot"></span>
        <span>3D EN VIVO</span>
      </div>

      <!-- Escenario del Avatar Vivo (Renderizado Three.js .glb real) -->
      <div id="avatar-3d-stage" class="avatar-stage">
        <!-- Canvas 3D de Three.js montado dinámicamente -->
      </div>
    `;

    this.container.appendChild(this.element);

    // Inicializar motor 3D Three.js con el modelo .glb
    const stage = this.element.querySelector('#avatar-3d-stage');
    this.avatar3D = new Avatar3DEngine(stage, {
      cameraFov: 26,
      cameraY: 1.62,
      cameraZ: 1.05,
      targetY: 1.58
    });
  }

  bindEvents() {
    // Clic en el avatar para provocar reacción de aplauso/asombro e interacción
    this.element.addEventListener('click', () => {
      this.playPokeAudio();
      simulatorState.triggerAvatarReaction('clapping');
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

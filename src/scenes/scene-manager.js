import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';

export class SceneManager {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.currentScene = simulatorState.getCurrentScene();
    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('div');
    this.element.id = 'scene-background-manager';
    this.element.className = 'scene-background-layer';

    // Transición sincronizada exactamente a 200ms con curva ease-in-out
    this.element.innerHTML = `
      <div id="scene-bg-park" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('./scenes/parque-familiar.jpg') no-repeat center center / cover; opacity: 1; transition: opacity 200ms ease-in-out;"></div>
      <div id="scene-bg-museum" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('./scenes/museo-arte.jpg') no-repeat center center / cover; opacity: 0; transition: opacity 200ms ease-in-out;"></div>
      <!-- Resplandor periférico de sol directo en exteriores -->
      <div id="solar-glare-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; background: radial-gradient(circle at 65% 20%, rgba(255, 245, 210, 0.28) 0%, rgba(255, 255, 255, 0) 65%); opacity: 1; transition: opacity 200ms ease-in-out;"></div>
    `;

    this.container.appendChild(this.element);
  }

  bindEvents() {
    const parkLayer = this.element.querySelector('#scene-bg-park');
    const museumLayer = this.element.querySelector('#scene-bg-museum');
    const glareLayer = this.element.querySelector('#solar-glare-overlay');

    eventBus.on('scene:change', ({ sceneId }) => {
      if (sceneId === 'park') {
        parkLayer.style.opacity = '1';
        museumLayer.style.opacity = '0';
        glareLayer.style.opacity = '1';
      } else {
        parkLayer.style.opacity = '0';
        museumLayer.style.opacity = '1';
        glareLayer.style.opacity = '0';
      }
    });
  }
}

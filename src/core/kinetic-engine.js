import { eventBus } from './event-bus.js';
import { simulatorState } from './simulator-state.js';

export class KineticEngine {
  constructor() {
    this.currentAbsorption = 0.05;
    this.targetAbsorption = 0.88;
    this.currentUv = 9.2;
    this.targetUv = 9.2;
    this.lastTimestamp = performance.now();
    this.isRunning = false;
    this.animationFrameId = null;

    this.bindEvents();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  bindEvents() {
    eventBus.on('scene:change', ({ scene }) => {
      this.targetUv = scene.uvIndex;
      this.updateTargetAbsorption();
    });

    eventBus.on('lens:change', () => {
      this.updateTargetAbsorption();
    });

    eventBus.on('screen:change', ({ screen }) => {
      if (screen === 'landing') {
        // Reset to clear when on landing
        this.targetAbsorption = 0.05;
      } else {
        this.updateTargetAbsorption();
      }
    });

    eventBus.on('kiosk:reset', () => {
      this.currentAbsorption = 0.05;
      this.targetAbsorption = 0.05;
      this.currentUv = 9.2;
      this.targetUv = 9.2;
    });
  }

  updateTargetAbsorption() {
    const scene = simulatorState.getCurrentScene();
    const lens = simulatorState.getCurrentLens();

    if (scene.id === 'park') {
      this.targetAbsorption = lens.maxAbsorption;
      this.targetUv = scene.uvIndex;
    } else {
      // Museum / indoor
      this.targetAbsorption = lens.minAbsorption;
      this.targetUv = scene.uvIndex;
    }
  }

  getOpticalCategory(absorption) {
    if (absorption < 0.20) return 'Cat. 0 Claridad Total';
    if (absorption < 0.57) return 'Cat. 1 Tinte Suave';
    if (absorption < 0.80) return 'Cat. 2 Tinte Moderado';
    if (absorption < 0.91) return 'Cat. 3 Sol Intenso';
    return 'Cat. 3+ Sol Extremo';
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1); // clamp delta time
    this.lastTimestamp = timestamp;

    const lens = simulatorState.getCurrentLens();
    const isDarkening = this.targetAbsorption > this.currentAbsorption;

    // Rate based on clinical lens kinetics
    let rate;
    if (isDarkening) {
      // Activation speed (e.g. 3.0s vs 11.5s for generic)
      const baseSpeed = 1.0 / Math.max(lens.activationSpeed || 3.0, 0.5);
      rate = baseSpeed * 1.8;
    } else {
      // Fade-back speed (smoother progressive return)
      const baseFade = 1.0 / Math.max(lens.fadeSpeed || 18.0, 2.0);
      rate = baseFade * 2.2;
    }

    // Exponential smoothing towards target
    const diff = this.targetAbsorption - this.currentAbsorption;
    if (Math.abs(diff) > 0.001) {
      this.currentAbsorption += diff * (1 - Math.exp(-rate * dt));
    } else {
      this.currentAbsorption = this.targetAbsorption;
    }

    // Smooth UV transition
    const uvDiff = this.targetUv - this.currentUv;
    if (Math.abs(uvDiff) > 0.05) {
      this.currentUv += uvDiff * (1 - Math.exp(-3.5 * dt));
    } else {
      this.currentUv = this.targetUv;
    }

    // Sync to simulatorState
    simulatorState.currentAbsorption = this.currentAbsorption;
    simulatorState.currentUv = this.currentUv;

    // Emit kinetic status
    const percentage = Math.round(this.currentAbsorption * 100);
    const category = this.getOpticalCategory(this.currentAbsorption);

    eventBus.emit('kinetic:update', {
      absorption: this.currentAbsorption,
      absorptionPercentage: percentage,
      uvIndex: this.currentUv.toFixed(1),
      category,
      lens,
      isDarkening,
    });

    this.animationFrameId = requestAnimationFrame(this.loop);
  }
}

export const kineticEngine = new KineticEngine();

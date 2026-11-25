import { eventBus } from './event-bus.js';
import { LENSES, SCENES } from './lenses-data.js';

class SimulatorState {
  constructor() {
    this.screen = 'landing'; // 'landing' | 'experience'
    this.currentSceneId = 'park'; // 'park' | 'museum'
    this.currentLensId = 'gens-amethyst'; // default lens (Signature Gen S)
    this.currentAbsorption = 0.05; // Starting clear
    this.targetAbsorption = 0.88;
    this.currentUv = 9.2;
    this.isFullscreen = false;
    this.isKineticActive = true;
    this.reactionAnimation = 'idle'; // 'idle' | 'clapping' | 'surprised'
    
    // Kiosk timer (5 minutos = 300,000 ms)
    this.kioskTimeoutMs = 5 * 60 * 1000;
    this.kioskTimerId = null;
    this.lastInteractionTime = Date.now();
  }

  init() {
    this.resetKioskTimer();
    this.setupInteractionListeners();
  }

  getCurrentLens() {
    return LENSES.find(l => l.id === this.currentLensId) || LENSES[0];
  }

  getCurrentScene() {
    return SCENES[this.currentSceneId.toUpperCase()] || SCENES.PARK;
  }

  setScreen(newScreen) {
    if (this.screen === newScreen) return;
    this.screen = newScreen;
    this.lastInteractionTime = Date.now();
    eventBus.emit('screen:change', { screen: this.screen });
    this.resetKioskTimer();
  }

  setScene(sceneId) {
    const validSceneKey = sceneId.toUpperCase();
    if (!SCENES[validSceneKey]) return;
    
    this.currentSceneId = sceneId.toLowerCase();
    this.lastInteractionTime = Date.now();
    const scene = SCENES[validSceneKey];
    this.currentUv = scene.uvIndex;

    eventBus.emit('scene:change', {
      sceneId: this.currentSceneId,
      scene,
      lens: this.getCurrentLens(),
    });
    this.resetKioskTimer();
  }

  setLens(lensId) {
    const lens = LENSES.find(l => l.id === lensId);
    if (!lens) return;

    this.currentLensId = lensId;
    this.lastInteractionTime = Date.now();

    // Trigger reaction on avatar when a new lens is chosen
    this.triggerAvatarReaction('clapping');

    eventBus.emit('lens:change', {
      lens,
      scene: this.getCurrentScene(),
    });
    this.resetKioskTimer();
  }

  triggerAvatarReaction(type = 'clapping') {
    this.reactionAnimation = type;
    eventBus.emit('avatar:reaction', { type });
    
    // Return to idle after celebration
    setTimeout(() => {
      this.reactionAnimation = 'idle';
      eventBus.emit('avatar:reaction', { type: 'idle' });
    }, 4500);
  }

  setupInteractionListeners() {
    const onInteract = () => {
      this.lastInteractionTime = Date.now();
      this.resetKioskTimer();
    };

    window.addEventListener('mousemove', onInteract, { passive: true });
    window.addEventListener('mousedown', onInteract, { passive: true });
    window.addEventListener('touchstart', onInteract, { passive: true });
    window.addEventListener('keydown', onInteract, { passive: true });
  }

  resetKioskTimer() {
    if (this.kioskTimerId) {
      clearTimeout(this.kioskTimerId);
    }

    this.kioskTimerId = setTimeout(() => {
      this.handleKioskTimeout();
    }, this.kioskTimeoutMs);
  }

  handleKioskTimeout() {
    if (this.screen !== 'landing') {
      console.log('Modo Kiosco: 5 minutos de inactividad detectados. Retornando a portada...');
      this.currentLensId = 'gens-amethyst';
      this.currentSceneId = 'park';
      this.currentAbsorption = 0.05;
      this.setScreen('landing');
      eventBus.emit('kiosk:reset', {});
    }
  }
}

export const simulatorState = new SimulatorState();

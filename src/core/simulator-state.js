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
    let lastResetTime = 0;

    const onInteract = () => {
      this.lastInteractionTime = Date.now();
      // Throttle el reinicio del temporizador para evitar sobrecarga en movimientos de puntero continuos
      if (Date.now() - lastResetTime > 1000) {
        lastResetTime = Date.now();
        this.resetKioskTimer();
      }
    };

    const interactionEvents = [
      'mousemove', 'mousedown', 'mouseup', 'click',
      'touchstart', 'touchmove', 'touchend',
      'pointerdown', 'pointermove', 'pointerup',
      'keydown', 'wheel', 'scroll'
    ];

    interactionEvents.forEach(evt => {
      window.addEventListener(evt, onInteract, { passive: true });
    });
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
      console.log('⏰ Modo Kiosco: 5 minutos de inactividad completados. Regresando a la portada de bienvenida...');
      
      // Salir de pantalla completa si estaba activada
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      // Restablecer configuraciones predeterminadas de simulación
      this.setScene('park');
      this.setLens('gens-amethyst');
      this.currentAbsorption = 0.05;
      this.setScreen('landing');
      eventBus.emit('kiosk:reset', {});
    }

    // Volver a armar el temporizador para la siguiente sesión
    this.resetKioskTimer();
  }
}

export const simulatorState = new SimulatorState();

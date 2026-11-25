import './styles/theme.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/landing.css';

import { simulatorState } from './core/simulator-state.js';
import { kineticEngine } from './core/kinetic-engine.js';
import { SceneManager } from './scenes/scene-manager.js';
import { GlassesPOV } from './components/glasses-pov.js';
import { LandingScreen } from './components/landing-screen.js';
import { HudHeader } from './components/hud-header.js';
import { LensSelector } from './components/lens-selector.js';
import { AvatarWidget } from './components/avatar-widget.js';

class LuminixApp {
  constructor() {
    this.appContainer = document.getElementById('app-container');
    this.uiLayer = null;
    this.init();
  }

  init() {
    // 1. Inicializar máquina de estado y temporizador Kiosco (5 min)
    simulatorState.init();

    // 2. Capa de Fondo (Escenas de Parque Familiar / Museo de Arte)
    new SceneManager(this.appContainer);

    // 3. Capa POV de Gafas Oftálmicas
    new GlassesPOV(this.appContainer);

    // 4. Capa de Interfaz y HUD
    this.uiLayer = document.createElement('div');
    this.uiLayer.className = 'ui-layer';

    // HUD Header (Logo + Medidor + Conmutador de Escena)
    new HudHeader(this.uiLayer);

    // Contenedor Inferior del HUD (Selector de Familias a la izquierda + Avatar Mini-Espejo a la derecha)
    const hudBody = document.createElement('div');
    hudBody.className = 'hud-body-container';
    new LensSelector(hudBody);
    new AvatarWidget(hudBody);
    this.uiLayer.appendChild(hudBody);

    this.appContainer.appendChild(this.uiLayer);

    // 5. Pantalla de Bienvenida / Portada Landing (Superpuesta)
    new LandingScreen(this.appContainer);

    // 6. Arrancar Motor Cinético Fotocromático (60 FPS)
    kineticEngine.start();

    // 7. Atajos de Teclado Profesionales para Consulta Clínica
    this.setupKeyboardShortcuts();

    console.log('%c🕶️ Luminix by Visiometric Labs inicializado con éxito', 'color: #38BDF8; font-weight: bold; font-size: 14px;');
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Tecla 'F' o 'f11' para pantalla completa
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }

      // Tecla 'Escape' para volver a la portada
      if (e.key === 'Escape' && simulatorState.screen === 'experience') {
        simulatorState.setScreen('landing');
      }

      // Tecla '1' -> Parque Familiar | '2' -> Museo de Arte
      if (e.key === '1') {
        simulatorState.setScene('park');
      } else if (e.key === '2') {
        simulatorState.setScene('museum');
      }
    });
  }
}

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  new LuminixApp();
});

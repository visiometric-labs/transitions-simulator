import { eventBus } from '../core/event-bus.js';
import { simulatorState } from '../core/simulator-state.js';
import { LENSES, LENS_FAMILIES } from '../core/lenses-data.js';

export class LensSelector {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('aside');
    this.element.className = 'lens-selector-card';
    this.element.setAttribute('aria-label', 'Selector de Tecnología y Color de Lente');

    let html = '';

    // Agrupación por familias ordenadas
    const families = Object.values(LENS_FAMILIES).sort((a, b) => a.order - b.order);

    families.forEach(family => {
      const familyLenses = LENSES.filter(l => l.familyId === family.id);
      if (familyLenses.length === 0) return;

      const isSingle = familyLenses.length === 1;

      html += `
        <div class="family-section">
          <span class="family-title">${family.name}</span>
          <div class="family-grid ${isSingle ? 'single-item' : ''}">
      `;

      familyLenses.forEach(lens => {
        const isActive = lens.id === simulatorState.currentLensId;
        const themeClass = `theme-${family.buttonTheme}`;

        html += `
          <button 
            type="button" 
            class="lens-swatch-btn ${themeClass} ${isActive ? 'active' : ''}" 
            data-lens-id="${lens.id}"
            title="${lens.name} — ${lens.description}"
            style="background: ${this.getSwatchBackground(lens)};"
            aria-label="${lens.name}">
          </button>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    this.element.innerHTML = html;
    this.container.appendChild(this.element);
  }

  getSwatchBackground(lens) {
    if (lens.mirrorEffect) {
      return `linear-gradient(135deg, ${lens.colorHex} 0%, ${lens.highlightColor} 100%)`;
    }
    return `linear-gradient(135deg, ${lens.colorHex} 0%, rgba(${lens.tintRgb.join(',')}, 0.8) 100%)`;
  }

  bindEvents() {
    const buttons = this.element.querySelectorAll('.lens-swatch-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const lensId = btn.getAttribute('data-lens-id');
        simulatorState.setLens(lensId);
      });
    });

    eventBus.on('lens:change', ({ lens }) => {
      buttons.forEach(btn => {
        if (btn.getAttribute('data-lens-id') === lens.id) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    });
  }
}

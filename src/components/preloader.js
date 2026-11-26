import { avatarModelCache } from '../core/avatar-model-cache.js';

/**
 * Preloader Óptico Profesional para Luminix
 * Precarga y renderiza todos los assets críticos:
 * - Entornos panorámicos 4K (parque y museo)
 * - Modelo 3D del Avatar anatómico (avatar.glb, 4.7 MB) con sus texturas y esqueleto
 * - Branding e identidades visuales
 * Garantiza que al abrir la portada el avatar aparezca DE INMEDIATO (0 segundos de espera).
 */
export class AppPreloader {
  constructor() {
    this.element = document.getElementById('app-preloader');
    this.progressFill = document.getElementById('preloader-progress-fill');
    this.statusText = document.getElementById('preloader-status');
    this.percentageText = document.getElementById('preloader-percentage');

    this.imagesToPreload = [
      './scenes/parque-familiar.jpg',
      './scenes/museo-arte.jpg',
      './avatar/avatar-hero.png',
      './avatar/avatar-clapping.png',
      './branding/favicon.svg',
    ];
  }

  async loadAssets() {
    if (!this.element) return;

    let imagesWeight = 0.25; // 25% peso para imágenes 2D
    let modelWeight = 0.75;  // 75% peso para el modelo 3D (4.7 MB)
    let imagesProgress = 0;
    let modelProgress = 0;

    const updateUI = () => {
      const totalRatio = (imagesProgress * imagesWeight) + (modelProgress * modelWeight);
      const pct = Math.min(100, Math.max(8, Math.round(totalRatio * 100)));
      if (this.progressFill) {
        this.progressFill.style.width = `${pct}%`;
      }
      if (this.percentageText) {
        this.percentageText.textContent = `${pct}%`;
      }
    };

    const updateStatus = (text) => {
      if (this.statusText) {
        this.statusText.textContent = text;
      }
    };

    updateStatus('Iniciando motor óptico Transitions®...');

    // 1. Descargar imágenes panorámicas y texturas 2D en paralelo
    let loadedImgs = 0;
    const totalImgs = this.imagesToPreload.length;
    const imgPromises = this.imagesToPreload.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedImgs++;
          imagesProgress = loadedImgs / totalImgs;
          updateUI();
          resolve();
        };
        img.src = url;
      });
    });

    // 2. Descargar y compilar modelo 3D del Avatar (avatar.glb 4.7 MB)
    updateStatus('Descargando avatar 3D y texturas faciales...');
    const modelPromise = avatarModelCache.load((ratio) => {
      modelProgress = ratio;
      const pct = Math.round(ratio * 100);
      updateStatus(`Descargando avatar 3D y cristales (${pct}%)...`);
      updateUI();
    });

    // Esperar a que AMBOS finalicen completamente antes de dar paso a la portada
    await Promise.all([...imgPromises, modelPromise]);

    imagesProgress = 1.0;
    modelProgress = 1.0;
    updateUI();
    updateStatus('¡Calibración completada! Desplegando experiencia...');

    await new Promise((r) => setTimeout(r, 220));

    // Desvanecer preloader suavemente
    this.element.classList.add('preloader-fade-out');
    await new Promise((r) => setTimeout(r, 500));

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

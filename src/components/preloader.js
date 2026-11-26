/**
 * Preloader Óptico Profesional para Luminix
 * Precarga y renderiza todos los assets críticos (imágenes 4K, avatares, texturas y branding)
 * antes de desplegar la portada de la aplicación.
 */
export class AppPreloader {
  constructor() {
    this.element = document.getElementById('app-preloader');
    this.progressFill = document.getElementById('preloader-progress-fill');
    this.statusText = document.getElementById('preloader-status');
    this.percentageText = document.getElementById('preloader-percentage');

    this.assetsToPreload = [
      './scenes/parque-familiar.jpg',
      './scenes/museo-arte.jpg',
      './avatar/avatar-hero.png',
      './avatar/avatar-clapping.png',
      './branding/favicon.svg',
    ];
  }

  async loadAssets() {
    if (!this.element) return;

    const total = this.assetsToPreload.length;
    let loaded = 0;
    const startTime = performance.now();

    const updateUI = (ratio, status) => {
      const pct = Math.round(ratio * 100);
      if (this.progressFill) {
        this.progressFill.style.width = `${pct}%`;
      }
      if (this.percentageText) {
        this.percentageText.textContent = `${pct}%`;
      }
      if (this.statusText && status) {
        this.statusText.textContent = status;
      }
    };

    updateUI(0.08, 'Iniciando motor óptico Transitions®...');

    const statuses = [
      'Descargando escena Parque Familiar (4K)...',
      'Descargando escena Museo de Arte (4K)...',
      'Optimizando texturas faciales del avatar...',
      'Sincronizando poses reactivas...',
      'Verificando identidad visual y branding...',
    ];

    const promises = this.assetsToPreload.map((url, idx) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          const ratio = Math.max(0.15, loaded / total);
          const currentStatus = statuses[idx] || 'Precargando recursos ópticos...';
          updateUI(ratio, currentStatus);
          resolve();
        };
        img.onerror = () => {
          // Si falla una imagen (p. ej. en offline), resolver igualmente para no bloquear la app
          loaded++;
          const ratio = Math.max(0.15, loaded / total);
          updateUI(ratio, 'Verificando componentes ópticos...');
          resolve();
        };
        img.src = url;
      });
    });

    await Promise.all(promises);

    // Asegurar un tiempo mínimo de cortesía (650ms) para evitar parpadeos bruscos en redes ultrarrápidas
    const elapsed = performance.now() - startTime;
    const minDisplayTime = 650;
    if (elapsed < minDisplayTime) {
      await new Promise((r) => setTimeout(r, minDisplayTime - elapsed));
    }

    updateUI(1.0, '¡Sistema calibrado! Desplegando experiencia...');
    await new Promise((r) => setTimeout(r, 220));

    // Desvanecimiento suave
    this.element.classList.add('preloader-fade-out');
    await new Promise((r) => setTimeout(r, 520));

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

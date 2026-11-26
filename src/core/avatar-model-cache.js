import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

/**
 * Gestor y Caché Centralizado del Modelo 3D del Avatar (avatar.glb)
 * Permite precargar los 4.7 MB del modelo y sus texturas durante la pantalla de carga,
 * evitando que la portada quede vacía durante varios segundos.
 */
class AvatarModelCache {
  constructor() {
    this.gltf = null;
    this.isLoading = false;
    this.loadPromise = null;
  }

  /**
   * Precarga el archivo avatar.glb con seguimiento porcentual real de descarga.
   * @param {function(number): void} onProgress Callback con ratio de 0.0 a 1.0
   * @returns {Promise<any>}
   */
  load(onProgress = null) {
    if (this.gltf) {
      if (onProgress) onProgress(1.0);
      return Promise.resolve(this.gltf);
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    const loader = new GLTFLoader();

    this.loadPromise = new Promise((resolve) => {
      loader.load(
        './avatar/avatar.glb',
        (gltf) => {
          this.gltf = gltf;
          this.isLoading = false;
          if (onProgress) onProgress(1.0);
          resolve(gltf);
        },
        (xhr) => {
          if (onProgress && xhr.total > 0) {
            const ratio = xhr.loaded / xhr.total;
            onProgress(Math.min(0.99, ratio));
          }
        },
        (error) => {
          console.warn('AvatarModelCache: Advertencia al precargar avatar.glb', error);
          this.isLoading = false;
          resolve(null); // Resuelve null para no bloquear el inicio si ocurre algún error de red
        }
      );
    });

    return this.loadPromise;
  }

  /**
   * Obtiene una copia independiente del esqueleto y mallas 3D para la escena.
   * Al estar precargado en memoria, la clonación toma menos de 5ms.
   * @returns {THREE.Group|null}
   */
  createModelInstance() {
    if (!this.gltf || !this.gltf.scene) {
      return null;
    }
    return SkeletonUtils.clone(this.gltf.scene);
  }

  isLoaded() {
    return !!this.gltf;
  }
}

export const avatarModelCache = new AvatarModelCache();

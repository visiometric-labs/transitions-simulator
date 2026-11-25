/**
 * Controlador de Cámara en Primera Persona para Luminix (Inspirado en la cinemática de Filters-Simulator)
 * 
 * Implementa la lógica de movimiento fisiológico del cuello humano:
 * - Rotación cinemática suave mediante Yaw (giro horizontal) y Pitch (inclinación vertical).
 * - Límites anatómicos fisiológicos del cuello.
 * - Inercia táctil cinemática (Momentum Fling) al soltar el dedo o ratón.
 * - Interpolación exponencial independiente del framerate (60Hz, 90Hz, 120Hz, 144Hz).
 * - Sin joystick virtual: control directo e intuitivo por arrastre táctil/ratón y teclado (WASD/flechas).
 */
export class CameraController {
  constructor() {
    // Ángulos actuales en radianes
    this.yaw = 0;
    this.pitch = 0;

    // Ángulos objetivo para interpolación suave
    this.targetYaw = 0;
    this.targetPitch = 0;

    // Inercia cinemática de arrastre (Momentum Fling)
    this.dragMomentumYaw = 0;
    this.dragMomentumPitch = 0;

    // Límites de cuello humano fisiológico en radianes
    this.maxYaw = Math.PI * 0.25;    // ~45° giro a la derecha
    this.minYaw = -Math.PI * 0.25;   // ~45° giro a la izquierda
    this.maxPitch = Math.PI * 0.20;  // ~36° inclinación arriba (mirar por encima de las gafas hacia el sol)
    this.minPitch = -Math.PI * 0.22; // ~40° inclinación abajo (mirar hacia el sendero/montura inferior)

    this.sensitivity = 1.25;
  }

  /**
   * Detiene de inmediato la inercia acumulada al iniciar un nuevo toque o clic
   */
  stopDragMomentum() {
    this.dragMomentumYaw = 0;
    this.dragMomentumPitch = 0;
  }

  /**
   * Recibe desplazamientos directos de arrastre táctil o ratón.
   * Calibrado ergonómicamente al viewport: recorrer ~65-70% de la pantalla cubre el campo visual.
   * 
   * @param {number} deltaX Desplazamiento horizontal en píxeles (positivo = mover a la derecha)
   * @param {number} deltaY Desplazamiento vertical en píxeles (positivo = mover hacia abajo)
   * @param {number} viewportWidth Ancho del contenedor o ventana
   * @param {number} viewportHeight Alto del contenedor o ventana
   */
  applyDelta(deltaX, deltaY, viewportWidth = 1000, viewportHeight = 600) {
    const yawRange = this.maxYaw - this.minYaw;     // ~1.57 rad
    const pitchRange = this.maxPitch - this.minPitch; // ~1.32 rad

    // Escala natural según dimensiones de pantalla
    const scaleX = (yawRange / Math.max(viewportWidth, 320)) * this.sensitivity;
    const scaleY = (pitchRange / Math.max(viewportHeight, 320)) * this.sensitivity;

    // deltaX positivo (arrastrar a la derecha) gira la cabeza a la derecha (+yaw)
    // deltaY negativo (arrastrar hacia arriba) inclina la cabeza hacia arriba (+pitch)
    const dYaw = deltaX * scaleX;
    const dPitch = -deltaY * scaleY;

    this.targetYaw += dYaw;
    this.targetPitch += dPitch;

    // Inercia táctil cinética (Momentum Fling suave)
    this.dragMomentumYaw = dYaw * 0.42;
    this.dragMomentumPitch = dPitch * 0.42;

    this.clampTargetYaw();
    this.clampTargetPitch();
  }

  /**
   * Pasos cinemáticos por teclado (WASD o Teclas de Flecha)
   */
  stepYaw(direction, amount = 0.08) {
    this.targetYaw += direction * amount;
    this.dragMomentumYaw = direction * amount * 0.35;
    this.clampTargetYaw();
  }

  stepPitch(direction, amount = 0.07) {
    this.targetPitch += direction * amount;
    this.dragMomentumPitch = direction * amount * 0.35;
    this.clampTargetPitch();
  }

  clampTargetYaw() {
    if (this.targetYaw > this.maxYaw) this.targetYaw = this.maxYaw;
    if (this.targetYaw < this.minYaw) this.targetYaw = this.minYaw;
  }

  clampTargetPitch() {
    if (this.targetPitch > this.maxPitch) this.targetPitch = this.maxPitch;
    if (this.targetPitch < this.minPitch) this.targetPitch = this.minPitch;
  }

  clampYaw() {
    if (this.yaw > this.maxYaw) this.yaw = this.maxYaw;
    if (this.yaw < this.minYaw) this.yaw = this.minYaw;
  }

  clampPitch() {
    if (this.pitch > this.maxPitch) this.pitch = this.maxPitch;
    if (this.pitch < this.minPitch) this.pitch = this.minPitch;
  }

  /**
   * Actualización cinemática por fotograma (independiente de framerate a 60, 90 o 120+ FPS)
   * @param {number} deltaTime Tiempo transcurrido en milisegundos desde el último cuadro
   */
  update(deltaTime = 16) {
    const dtSeconds = Math.min(deltaTime, 64) / 1000;

    // 1. Aplicar inercia cinemática al soltar el dedo / ratón
    if (Math.abs(this.dragMomentumYaw) > 0.00005 || Math.abs(this.dragMomentumPitch) > 0.00005) {
      this.targetYaw += this.dragMomentumYaw;
      this.targetPitch += this.dragMomentumPitch;
      this.clampTargetYaw();
      this.clampTargetPitch();

      // Fricción suave y progresiva
      this.dragMomentumYaw *= 0.88;
      this.dragMomentumPitch *= 0.88;
    }

    // 2. Interpolación exponencial continua (amortiguación suave)
    // Tau = ~38ms -> Respuesta instantánea al toque con parada suave
    const lerpFactor = 1.0 - Math.exp(-24 * dtSeconds);
    this.yaw += (this.targetYaw - this.yaw) * lerpFactor;
    this.pitch += (this.targetPitch - this.pitch) * lerpFactor;

    this.clampYaw();
    this.clampPitch();
  }

  /**
   * Recentra suavemente la mirada hacia el centro frontal
   */
  recenter() {
    this.targetYaw = 0;
    this.targetPitch = 0;
    this.stopDragMomentum();
  }

  /**
   * Retorna coordenadas normalizadas de mirada (-1 a +1) compatibles con el renderizador POV
   * - gazeX: [-1, +1] -> izquierda (-) a derecha (+)
   * - gazeY: [-1, +1] -> arriba (-) a abajo (+) (gazeY < 0 eleva la vista sobre las gafas)
   */
  getNormalizedGaze() {
    const gazeX = Math.max(-1, Math.min(1, this.yaw / this.maxYaw));
    
    // Si pitch > 0 (mira arriba), gazeY es negativo (para desplazar las gafas abajo y mirar al sol)
    // Si pitch < 0 (mira abajo), gazeY es positivo
    const gazeY = this.pitch >= 0
      ? -Math.min(1, this.pitch / this.maxPitch)
      : Math.min(1, -this.pitch / Math.abs(this.minPitch));

    const isDisplaced = Math.abs(gazeX) > 0.12 || Math.abs(gazeY) > 0.12;

    return { gazeX, gazeY, isDisplaced, yaw: this.yaw, pitch: this.pitch };
  }
}

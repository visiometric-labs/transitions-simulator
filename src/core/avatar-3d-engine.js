import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { avatarModelCache } from './avatar-model-cache.js';
import { eventBus } from './event-bus.js';
import { simulatorState } from './simulator-state.js';

export class Avatar3DEngine {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = {
      cameraFov: options.cameraFov || 30,
      cameraY: options.cameraY || 1.62,
      cameraZ: options.cameraZ || 1.15,
      targetY: options.targetY || 1.58,
      isHero: options.isHero || false,
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.avatarModel = null;
    this.glassesMesh = null; // Marco de las gafas (Wolf3D_Glasses)
    this.lensMesh = null;    // Cristales ópticos físicos (SkinnedMesh dedicado)
    this.lensMaterial = null; // Material PBR exclusivo de los cristales ópticos
    this.headMesh = null;
    this.bones = {};
    this.morphTargets = {};

    // Animation & Autonomous Gaze State (Sin seguimiento del cursor)
    this.clock = new THREE.Clock();
    this.headGazeState = {
      currentYaw: 0,
      currentPitch: 0,
      currentRoll: 0,
      targetYaw: 0,
      targetPitch: 0,
      targetRoll: 0,
      timer: 0,
      duration: 4.5, // Mirar al frente es el más frecuente y de más duración (3.5 - 7.0s)
      isFront: true
    };

    this.isBlinking = false;
    this.blinkProgress = 0;
    this.nextBlinkTime = 2.5;
    this.smileIntensity = 0.25;
    this.targetSmile = 0.25;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 300;
    const height = this.container.clientHeight || 300;

    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Camera setup focused on upper body / head
    this.camera = new THREE.PerspectiveCamera(this.options.cameraFov, width / height, 0.1, 100);
    this.camera.position.set(0, this.options.cameraY, this.options.cameraZ);
    this.camera.lookAt(0, this.options.targetY, 0);

    // 3. WebGL Renderer with Alpha Transparent Background
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.pointerEvents = 'none';

    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting setup (Studio clinical lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    keyLight.position.set(1.5, 2.5, 2);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.2);
    fillLight.position.set(-1.5, 1.5, 1.5);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(0, 2, -1.5);
    this.scene.add(rimLight);

    // 5. Load GLB Model
    this.loadModel();

    // 6. Bind Events
    this.bindEvents();

    // 7. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  loadModel() {
    // 1. Si el modelo ya está precargado en memoria (0ms), configurarlo de inmediato sin esperar
    if (avatarModelCache.isLoaded()) {
      const clonedScene = avatarModelCache.createModelInstance();
      if (clonedScene) {
        this.setupLoadedModel(clonedScene);
        return;
      }
    }

    // 2. Si todavía se está descargando, resolver tan pronto finalice
    avatarModelCache.load().then((gltf) => {
      if (gltf) {
        const clonedScene = avatarModelCache.createModelInstance();
        if (clonedScene) {
          this.setupLoadedModel(clonedScene);
        }
      }
    }).catch((error) => {
      console.warn('Three.js GLTF fallback: Error al instanciar avatar.glb', error);
    });
  }

  setupLoadedModel(model) {
    this.avatarModel = model;
    this.avatarModel.position.set(0, 0, 0);

    // Identificar huesos, mallas y objetivos morfométricos
    this.avatarModel.traverse((node) => {
      if (node.isBone) {
        this.bones[node.name] = node;
      }

      if (node.isMesh) {
        node.frustumCulled = false;

        // Malla del Marco de las Gafas (Wolf3D_Glasses)
        if (node.name.includes('Glasses')) {
          this.glassesMesh = node;
          this.setupGlassesFrameMaterial(node);
          this.createGlassLenses(node);
        }

        // Malla de la Cabeza para Expresiones Faciales (Wolf3D_Head)
        if (node.name === 'Wolf3D_Head') {
          this.headMesh = node;
          if (node.morphTargetDictionary) {
            this.morphTargets = node.morphTargetDictionary;
          }
        }
      }
    });

    this.scene.add(this.avatarModel);

    // Si hay una imagen de placeholder temporal, ocultarla suavemente
    if (this.container) {
      const placeholder = this.container.querySelector('.landing-avatar-placeholder');
      if (placeholder) {
        placeholder.classList.add('loaded');
      }
    }

    // Aplicar tinte inicial de la lente seleccionada (con previsualización nítida en portada)
    const initialLens = simulatorState.getCurrentLens();
    const initialAbsorption = (this.options.isHero && simulatorState.screen === 'landing') ? 0.72 : simulatorState.currentAbsorption;
    this.updateGlassesTint(initialLens, initialAbsorption);
  }

  /**
   * Configura el material del MARCO de las gafas (Wolf3D_Glasses).
   * El marco permanece SIEMPRE oscuro tipo acetato obsidiana elegante y NUNCA cambia de color.
   */
  setupGlassesFrameMaterial(glassesNode) {
    glassesNode.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x181e28), // Acetato negro mate/satinado premium
      roughness: 0.85,
      metalness: 0.05,
      depthWrite: true
    });
  }

  /**
   * Crea una malla física separada exclusivamente para los CRISTALES ÓPTICOS.
   * Utiliza el mismo esqueleto que las gafas (articulado con el hueso Head) para seguir los movimientos faciales con 100% de precisión.
   */
  createGlassLenses(glassesNode) {
    const positions = [];
    const uvs = [];
    const indices = [];
    const skinIndices = [];
    const skinWeights = [];

    // Función auxiliar para generar un disco elíptico curvado para cada cristal óptico
    const addLensDisc = (cx, cy, cz, rx, ry, segments = 24) => {
      const baseIdx = positions.length / 3;
      // Vértice central
      positions.push(cx, cy, cz);
      uvs.push(0.5, 0.5);
      skinIndices.push(5, 0, 0, 0); // Hueso 5 es 'Head'
      skinWeights.push(1, 0, 0, 0);

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const px = cx + Math.cos(theta) * rx;
        const py = cy + Math.sin(theta) * ry;
        // Curvatura óptica natural hacia atrás en la periferia
        const pz = cz - 0.002 * Math.cos(theta);
        positions.push(px, py, pz);
        uvs.push((Math.cos(theta) + 1) / 2, (Math.sin(theta) + 1) / 2);
        skinIndices.push(5, 0, 0, 0);
        skinWeights.push(1, 0, 0, 0);
      }

      for (let i = 1; i <= segments; i++) {
        indices.push(baseIdx, baseIdx + i, baseIdx + i + 1);
        indices.push(baseIdx, baseIdx + i + 1, baseIdx + i);
      }
    };

    // Cristal Izquierdo y Derecho posicionados en las aberturas exactas del marco
    addLensDisc(0.039, 1.625, 0.134, 0.0275, 0.0185);
    addLensDisc(-0.039, 1.625, 0.134, 0.0275, 0.0185);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geom.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    // Material exclusivo de los cristales: SOLO EL COLOR, SIN DESLUMBRAMIENTO NI HAZES DE LUZ
    this.lensMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x38bdf8),
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    this.lensMesh = new THREE.SkinnedMesh(geom, this.lensMaterial);
    if (glassesNode.skeleton) {
      this.lensMesh.bind(glassesNode.skeleton, glassesNode.bindMatrix);
    }
    this.avatarModel.add(this.lensMesh);

    // Aplicar tinte inicial de la lente seleccionada (con previsualización nítida en portada)
    const initialLens = simulatorState.getCurrentLens();
    const initialAbsorption = (this.options.isHero && simulatorState.screen === 'landing') ? 0.72 : simulatorState.currentAbsorption;
    this.updateGlassesTint(initialLens, initialAbsorption);
  }

  /**
   * Actualiza el tinte ÚNICAMENTE en el cristal del lente (this.lensMaterial),
   * mostrando el color solo, sin reflejos ni haces de luz.
   */
  updateGlassesTint(lens, absorption) {
    if (!this.lensMaterial || !lens) return;

    const [r, g, b] = lens.tintRgb;
    const material = this.lensMaterial;

    // Actualizar tono cromático puro del cristal (sin luces especulares ni reflejos)
    material.color.setRGB(r / 255, g / 255, b / 255);

    // Ajustar opacidad según la cinética de absorción:
    // En interiores/claro: opacidad suave 0.16 para que se vean los ojos con claridad
    // En exteriores/oscuro: opacidad hasta 0.86 con el color uniforme de la lente
    const targetOpacity = Math.max(0.16, Math.min(0.86, absorption * 0.90));
    material.opacity = targetOpacity;
  }

  bindEvents() {
    // Escucha de cambio de lente
    eventBus.on('lens:change', ({ lens }) => {
      const absorption = (this.options.isHero && simulatorState.screen === 'landing')
        ? 0.72
        : simulatorState.currentAbsorption;
      this.updateGlassesTint(lens, absorption);
    });

    // Escucha cinética de oscurecimiento de lentes
    eventBus.on('kinetic:update', ({ absorption, lens }) => {
      const effAbsorption = (this.options.isHero && simulatorState.screen === 'landing')
        ? 0.72
        : absorption;
      this.updateGlassesTint(lens, effAbsorption);
    });

    // Reacciones del avatar (aplauso / alegría)
    eventBus.on('avatar:reaction', ({ type }) => {
      if (type === 'clapping') {
        this.targetSmile = 0.85;
      } else {
        this.targetSmile = 0.25;
      }
    });

    // Redimensionamiento
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w === 0 || h === 0) return;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  /**
   * Máquina de estados para movimientos autónomos y aleatorios de la cabeza y mirada:
   * Mirar al frente es el estado más frecuente y de mayor duración (~70% del tiempo).
   */
  updateAutonomousGaze(delta, elapsedTime) {
    const gaze = this.headGazeState;
    gaze.timer += delta;

    if (gaze.timer >= gaze.duration) {
      gaze.timer = 0;

      // Si estaba mirando a un lado, retornar al frente con 85% de probabilidad
      if (!gaze.isFront) {
        gaze.targetYaw = 0;
        gaze.targetPitch = 0;
        gaze.targetRoll = 0;
        gaze.duration = 3.5 + Math.random() * 3.5; // Permanece mirando al frente 3.5 - 7.0 segundos
        gaze.isFront = true;
      } else {
        const rand = Math.random();
        if (rand < 0.60) {
          // 60% de probabilidad: continuar mirando al frente, renovando duración
          gaze.targetYaw = 0;
          gaze.targetPitch = 0;
          gaze.targetRoll = 0;
          gaze.duration = 3.0 + Math.random() * 3.0;
          gaze.isFront = true;
        } else if (rand < 0.78) {
          // Mirada sutil hacia la izquierda
          gaze.targetYaw = 0.12 + Math.random() * 0.10;
          gaze.targetPitch = (Math.random() - 0.5) * 0.05;
          gaze.targetRoll = (Math.random() - 0.5) * 0.03;
          gaze.duration = 1.2 + Math.random() * 0.9;
          gaze.isFront = false;
        } else if (rand < 0.93) {
          // Mirada sutil hacia la derecha
          gaze.targetYaw = -(0.12 + Math.random() * 0.10);
          gaze.targetPitch = (Math.random() - 0.5) * 0.05;
          gaze.targetRoll = (Math.random() - 0.5) * 0.03;
          gaze.duration = 1.2 + Math.random() * 0.9;
          gaze.isFront = false;
        } else {
          // Asentimiento suave o leve inclinación reflexiva
          gaze.targetYaw = (Math.random() - 0.5) * 0.06;
          gaze.targetPitch = 0.07 + Math.random() * 0.07;
          gaze.targetRoll = (Math.random() - 0.5) * 0.03;
          gaze.duration = 1.0 + Math.random() * 0.8;
          gaze.isFront = false;
        }
      }
    }

    // Interpolación suave amortiguada hacia el ángulo objetivo
    const lerpSpeed = Math.min(1.0, delta * 3.0);
    gaze.currentYaw += (gaze.targetYaw - gaze.currentYaw) * lerpSpeed;
    gaze.currentPitch += (gaze.targetPitch - gaze.currentPitch) * lerpSpeed;
    gaze.currentRoll += (gaze.targetRoll - gaze.currentRoll) * lerpSpeed;

    // Micro-movimientos biológicos de respiración y presencia viva (estilo Talking Cat)
    const microSwayY = Math.sin(elapsedTime * 1.1) * 0.012;
    const microSwayX = Math.cos(elapsedTime * 1.4) * 0.008;

    const head = this.bones['Head'] || this.bones['head'];
    const neck = this.bones['Neck'] || this.bones['neck'];

    if (head) {
      head.rotation.y = gaze.currentYaw * 0.70 + microSwayY;
      head.rotation.x = gaze.currentPitch * 0.70 + microSwayX;
      head.rotation.z = gaze.currentRoll * 0.70;
    }
    if (neck) {
      neck.rotation.y = gaze.currentYaw * 0.30;
      neck.rotation.x = gaze.currentPitch * 0.30;
      neck.rotation.z = gaze.currentRoll * 0.30;
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Respiración orgánica general
    const breathOffset = Math.sin(elapsedTime * 1.8) * 0.008;
    if (this.avatarModel) {
      this.avatarModel.position.y = breathOffset;
    }

    // 2. Movimiento autónomo y aleatorio de cabeza (mirar al frente predominante)
    this.updateAutonomousGaze(delta, elapsedTime);

    // 3. Pestañeo Involuntario Fisiológico (Morph Targets)
    if (this.headMesh && this.morphTargets) {
      const blinkLeftIdx = this.morphTargets['eyeBlinkLeft'];
      const blinkRightIdx = this.morphTargets['eyeBlinkRight'];

      if (elapsedTime > this.nextBlinkTime && !this.isBlinking) {
        this.isBlinking = true;
        this.blinkProgress = 0;
      }

      if (this.isBlinking) {
        this.blinkProgress += delta * 12; // Velocidad del pestañeo
        let blinkVal = 0;
        if (this.blinkProgress <= 1) {
          blinkVal = Math.sin(this.blinkProgress * Math.PI);
        } else {
          this.isBlinking = false;
          blinkVal = 0;
          this.nextBlinkTime = elapsedTime + 2.5 + Math.random() * 3.0; // Próximo pestañeo en 2.5-5.5s
        }

        if (blinkLeftIdx !== undefined) this.headMesh.morphTargetInfluences[blinkLeftIdx] = blinkVal;
        if (blinkRightIdx !== undefined) this.headMesh.morphTargetInfluences[blinkRightIdx] = blinkVal;
      }

      // Sonrisa
      this.smileIntensity += (this.targetSmile - this.smileIntensity) * 0.08;
      const smileIdx = this.morphTargets['mouthSmile'];
      if (smileIdx !== undefined) {
        this.headMesh.morphTargetInfluences[smileIdx] = this.smileIntensity;
      }
    }

    // 4. Render Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

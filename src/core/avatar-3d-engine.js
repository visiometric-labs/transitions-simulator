import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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
    this.glassesMesh = null;
    this.headMesh = null;
    this.bones = {};
    this.morphTargets = {};

    // Animation & State
    this.clock = new THREE.Clock();
    this.targetMouse = { x: 0, y: 0 };
    this.currentMouse = { x: 0, y: 0 };
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
    const loader = new GLTFLoader();
    loader.load(
      './avatar/avatar.glb',
      (gltf) => {
        this.avatarModel = gltf.scene;
        this.avatarModel.position.set(0, 0, 0);

        // Identify key meshes, materials, and bones
        this.avatarModel.traverse((node) => {
          if (node.isBone) {
            this.bones[node.name] = node;
          }

          if (node.isMesh) {
            node.frustumCulled = false;

            // Glasses Mesh (Wolf3D_Glasses)
            if (node.name.includes('Glasses')) {
              this.glassesMesh = node;
              this.setupGlassesMaterial(node);
            }

            // Head Mesh with Morph Targets
            if (node.name === 'Wolf3D_Head') {
              this.headMesh = node;
              if (node.morphTargetDictionary) {
                this.morphTargets = node.morphTargetDictionary;
              }
            }
          }
        });

        this.scene.add(this.avatarModel);
        this.updateGlassesTint(simulatorState.getCurrentLens(), simulatorState.currentAbsorption);
      },
      undefined,
      (error) => {
        console.warn('Three.js GLTF fallback: Error loading avatar.glb, keeping fallback illustration.', error);
      }
    );
  }

  setupGlassesMaterial(glassesNode) {
    // Clone and upgrade material for physical transparency & optical transmission
    glassesNode.material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x334155),
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.65,
      thickness: 0.5,
      transparent: true,
      opacity: 0.35,
      reflectivity: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
  }

  updateGlassesTint(lens, absorption) {
    if (!this.glassesMesh || !this.glassesMesh.material || !lens) return;

    const [r, g, b] = lens.tintRgb;
    const material = this.glassesMesh.material;

    // Actualizar color PBR de la lente
    material.color.setRGB(r / 255, g / 255, b / 255);

    // Ajustar opacidad según absorción
    const targetOpacity = Math.max(0.18, Math.min(0.88, absorption * 0.92));
    material.opacity = targetOpacity;
    material.transmission = Math.max(0.08, 1.0 - (absorption * 0.85));

    // Efecto espejo (Style Mirrors)
    if (lens.mirrorEffect) {
      material.metalness = 0.82;
      material.roughness = 0.08;
      material.reflectivity = 0.95;
    } else {
      material.metalness = 0.05;
      material.roughness = 0.12;
      material.reflectivity = 0.5;
    }
  }

  bindEvents() {
    // Escucha cinética de oscurecimiento de lentes
    eventBus.on('kinetic:update', ({ absorption, lens }) => {
      this.updateGlassesTint(lens, absorption);
    });

    // Reacciones del avatar (aplauso / alegría)
    eventBus.on('avatar:reaction', ({ type }) => {
      if (type === 'clapping') {
        this.targetSmile = 0.85;
      } else {
        this.targetSmile = 0.25;
      }
    });

    // Seguimiento del cursor con el ratón
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

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

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Interpolación suave de seguimiento del ratón (Look-at natural)
    this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.05;
    this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.05;

    // 2. Respiración orgánica estilo "My Talking Cat"
    const breathOffset = Math.sin(elapsedTime * 1.8) * 0.008;
    if (this.avatarModel) {
      this.avatarModel.position.y = breathOffset;
    }

    // 3. Movimiento de Huesos de Cabeza y Cuello (Head Tracking)
    const head = this.bones['Head'] || this.bones['head'];
    const neck = this.bones['Neck'] || this.bones['neck'];

    if (head) {
      head.rotation.y = this.currentMouse.x * 0.35 + Math.sin(elapsedTime * 0.8) * 0.02;
      head.rotation.x = -this.currentMouse.y * 0.25 + Math.cos(elapsedTime * 1.2) * 0.015;
    }
    if (neck) {
      neck.rotation.y = this.currentMouse.x * 0.15;
      neck.rotation.x = -this.currentMouse.y * 0.10;
    }

    // 4. Pestañeo Involuntario Fisiológico (Morph Targets)
    if (this.headMesh && this.morphTargets) {
      const blinkLeftIdx = this.morphTargets['eyeBlinkLeft'];
      const blinkRightIdx = this.morphTargets['eyeBlinkRight'];

      if (elapsedTime > this.nextBlinkTime && !this.isBlinking) {
        this.isBlinking = true;
        this.blinkProgress = 0;
      }

      if (this.isBlinking) {
        this.blinkProgress += delta * 12; // Velocidad del pestañeo (rápido y natural)
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

    // 5. Render Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

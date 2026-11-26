# 🤖 AI_CONTEXT.md — Guía Maestra para Agentes de IA y Desarrolladores

> **Documento de Contexto y Especificación Técnica para Luminix**  
> Si eres una IA que retoma este proyecto o un desarrollador continuando el trabajo, **lee atentamente este archivo antes de realizar cualquier cambio**.

---

## 📌 1. Identidad del Proyecto
* **Nombre Oficial:** Luminix by Visiometric Labs
* **Organización:** Visiometric Labs
* **Autor / Propietario:** JayzirTech
* **Carpeta Local del Proyecto:** `transitions-simulator`
* **Repositorio Remoto en GitHub:** `https://github.com/visiometric-labs/transitions-simulator.git`
* **URL en Producción (GitHub Pages):** `https://visiometric-labs.github.io/transitions-simulator/`
* **Identidad Visual y Activos Gráficos:**
  - `public/branding/og-card-whatsapp.png` (y `.jpg`): Banner social 1200×630 para WhatsApp, Open Graph y Twitter Cards.
  - `public/branding/profile-picture.png` (y `.jpg`): Avatar institucional 1024×1024 con isotipo Luminix.
  - `public/branding/favicon.svg`: Isotipo vectorial con retículo óptico y gafas estilizadas.
* **Ecosistema de Hermanos:**
  - `filters-simulator` -> **Chromatis** (Simulador clínico de tratamientos ópticos: Blue Cut, Conducción, Crizal Antirreflejo)
  - `refraction-simulator` -> **Ocularis** (Simulador clínico de refracción óptica, patologías y anatomía ocular)
  - `transitions-simulator` -> **Luminix** (Simulador y probador virtual de lentes fotosensibles y tecnología Transitions)

---

## 🌿 2. Estrategia de Ramas Git y Despliegue CI/CD
* **Rama de Trabajo Predeterminada:** **`dev`**
  - Cualquier nueva característica, ajuste o sesión de trabajo **debe realizarse en la rama `dev`**.
* **Rama de Producción:** **`main`**
  - Reservada exclusivamente para versiones estables.
  - El flujo `.github/workflows/deploy.yml` compila con `vite build --base=/transitions-simulator/` y despliega automáticamente en **GitHub Pages** únicamente cuando se hace push a `main`.
* **Regla de Oro:** **NUNCA** desarrollar directamente sobre `main` sin pasar por `dev`. Una vez probado en `dev`, se fusiona en `main` y se empuja a `origin/main`.

---

## 🔬 3. Arquitectura Implementada y Estado Actual

A fecha de hoy, la plataforma cuenta con una arquitectura de grado clínico completamente operativa:

### A. Motor Óptico de Primera Persona (POV) con Cinemática Fisiológica
* Archivos: `src/core/camera-controller.js`, `src/components/glasses-pov.js`, `src/scenes/scene-manager.js`, `src/styles/layout.css`, `src/styles/components.css`.
* **Cinemática de Cuello Humano (Inspirada en Filters-Simulator, sin joystick)**:
  - Modelo fisiológico de rotación con ángulos Yaw (horizontal ~±45°) y Pitch (vertical ~+36° / -40°).
  - Inercia táctil cinemática (*Momentum Fling*) con fricción suave (`*= 0.88`) al soltar el dedo o ratón.
  - Amortiguación exponencial independiente del framerate (`1.0 - Math.exp(-24 * dtSeconds)`) para una respuesta sedosa a 60Hz, 90Hz o 120Hz+.
  - Control por arrastre directo (táctil o ratón) y atajos de teclado (WASD / Flechas) sin necesidad de joystick virtual.
* **Visión al Descubierto (Sin Gafas)**:
  - 4 capas graduadas: Base fotográfica sobreexpuesta (50,000+ lux), Bloom corneal (`mix-blend-mode: screen`), Puntos calientes especulares (`mix-blend-mode: color-dodge`) y Velo solar cegador con rayos volumétricos y destellos anamórficos (deslumbramiento calibrado a nivel óptimo para demostración clínica).
* **Visión a Través del Cristal (Transitions®)**:
  - Totalmente libre de deslumbramiento, luminosidad relajada (0.70 a 0.86), contraste optimizado (1.20) y saturación viva.
  - Tintado multiply suave con el color auténtico de la familia seleccionada (Signature Gen S, XTRActive, Style Mirrors, Estándar).
* **Navegación Interactiva de la Mirada (Gaze POV) en Desktop y Móvil**:
  - **Soporte Táctil Completo en Celulares y Tablets**: Eventos táctiles nativos (`touchstart`, `touchmove`, `touchend`, `touchcancel`) con `{ passive: false }` y `preventDefault()` para evitar bloqueos por gestos del navegador móvil (pull-to-refresh, bounce scrolling).
  - **Intercepción de Puntero Corregida**: Contenedores estructurales (`.hud-header-container`, `.hud-body-container`) configurados con `pointer-events: none;`, dejando solo los botones y controles específicos con `pointer-events: auto;`. De esta forma, cualquier toque en el área visual y periférica arrastra la mirada sin obstáculos.
  - Al inclinar la vista hacia arriba (`pitch > 0`, `gazeY < 0`), el usuario mira **directamente por encima de las gafas** hacia el sol cegador.
  - Al regresar al centro, el usuario experimenta el alivio inmediato del lente.
  - Botón flotante para recentrar la mirada a voluntad (`#btn-recenter-gaze`) o doble toque/doble clic.
* **Sincronización Óptica y Proyección Unificada al Sub-Píxel**:
  - Tanto el fondo exterior (`SceneManager`) como la vista interior de los cristales (`GlassesPOV`) comparten la misma proyección vectorial SVG con `viewBox="0 0 1920 1080"` y `preserveAspectRatio="xMidYMid slice"`.
  - Ambas capas emplean las mismas dimensiones y encuadre base (`x="-160" y="-85" width="2240" height="1250"`), garantizando que en reposo o movimiento cualquier elemento del paisaje (árboles, sendero, edificios) coincida con precisión milimétrica sin cortes ni saltos de escala al cruzar el borde del lente.
  - El paneo del mundo se actualiza instantáneamente en cada fotograma (`worldPanX = -gazeX * 120`, `worldPanY = -gazeY * 70`) sin transiciones diferidas CSS (`0.08s ease-out` eliminado).
  - La montura y la apertura binocular (`<clipPath id="lenses-binocular-clip">`) se mueven de forma coordinada con la cabeza, mientras que la imagen dentro del cristal permanece fija en las coordenadas del mundo real.

### B. Ausencia Absoluta de Efectos de Sonido
* La aplicación es 100% silenciosa en todas sus interacciones, clics y transiciones, garantizando un entorno profesional sin ruidos inesperados en la consulta optométrica.

### C. Avatar 3D Real (Three.js + GLTF + WebGL)
* Archivo: `src/core/avatar-3d-engine.js`.
* **Modelo 3D:** `public/avatar/avatar.glb` con esqueleto óseo, blendshapes faciales y materiales PBR.
* **Comportamiento Autónomo:**
  - Máquina de estados autónoma (no sigue el cursor): mirar al frente es la orientación predominante y de mayor duración (~70% del tiempo), con giros sutiles aleatorios y parpadeo involuntario fisiológico.
* **Separación de Marco vs. Cristal:**
  - `Wolf3D_Glasses` (el marco) mantiene un material de acetato negro mate/satinado (`#181e28`) que **jamás cambia de color**.
  - Cristales independientes (`THREE.SkinnedMesh` con `MeshPhysicalMaterial`) articulados con el hueso de la cabeza, sobre los cuales se modula exclusivamente la absorción, color, opacidad y reflejo espejo.

### C. Escenarios y Transición Sincronizada
* **Parque Familiar:** Exteriores a mediodía, UV 9.2, activación cinética rápida (~25 s).
* **Museo de Arte:** Interiores con luz artificial suave, UV 0.1, aclarado acelerado.
* **Transición de 200 ms:** Tanto el fondo como el interior de los cristales binoculares realizan una progresión sincronizada de 200 ms.

### D. Portada Clínica, Selector de Tinte Sutil y Modo Kiosco
* Archivos: `src/components/landing-screen.js`, `src/styles/landing.css`.
* Sin sliders inertes; incluye fichas clínicas de la tecnología *Transitions® Gen S™* y la *Cabina de Demostración*.
* Selector de tintes sutil (`.landing-hero-tint-bar`) ubicado justo debajo del marco del avatar con el mismo ancho exacto, permitiendo previsualizar tonalidades (Amatista, Rubí, Zafiro, Esmeralda, Ámbar, Gris) antes de entrar al simulador.
* Botón de salir de pantalla completa condicional (solo visible si el navegador ya está en pantalla completa).
* Temporizador de inactividad de **5 minutos** que regresa a la portada automáticamente con reseteo de escena y lente.

### E. Preloader Clínico y Precarga Instantánea del Avatar 3D
* Archivos: `src/components/preloader.js`, `src/core/avatar-model-cache.js`, `src/core/avatar-3d-engine.js`.
* Pantalla de precarga inicial con animación de retícula óptica, barra de progreso y porcentaje.
* Precarga previa y clonación en memoria (`avatarModelCache.preload()` con `SkeletonUtils.clone`) del modelo GLB (4.7 MB) e imágenes base, eliminando cualquier demora al renderizar el avatar en la portada.
* El avatar 3D real (`avatar.glb`, femenino) se renderiza directamente de forma síncrona en el primer fotograma tras el preloader, garantizando coherencia visual inmediata sin imágenes temporales estáticas ni parpadeos.

---

## ⚙️ 4. Guía Rápida para Continuar el Proyecto

```bash
# 1. Asegurarse de estar en la rama de desarrollo
git checkout dev

# 2. Instalar dependencias si es necesario
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar para producción (validación de bundle)
npx vite build --base=/transitions-simulator/

# 5. Flujo de despliegue a GitHub Pages tras verificar cambios en dev
git commit -am "tipo: descripción clara del cambio"
git push origin dev
git checkout main
git merge dev
git push origin main
git checkout dev
```

---

## 🏢 5. Autoría y Licencia
* **Organización:** Visiometric Labs
* **Autor:** JayzirTech
* **Copyright:** © 2026 JayzirTech. Todos los derechos reservados.

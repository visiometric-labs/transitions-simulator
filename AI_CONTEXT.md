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
* **Ecosistema de Hermanos:**
  - `filters-simulator` -> **Chromatis** (Simulador clínico de filtros oftálmicos: Blue Cut, Conducción, Antirreflejo)
  - `refraction-simulator` -> **Ocularis** (Simulador clínico de refracción óptica, patologías y anatomía)
  - `transitions-simulator` -> **Luminix** (Simulador y probador virtual de lentes fotosensibles y tecnología Transitions)

---

## 🌿 2. Estrategia de Ramas Git y Despliegue CI/CD
* **Rama de Trabajo Predeterminada:** **`dev`**
  - Cualquier nueva característica, ajuste o sesión de trabajo **debe realizarse en la rama `dev`**.
* **Rama de Producción:** **`main`**
  - Reservada exclusivamente para versiones estables.
  - El flujo `.github/workflows/deploy.yml` compila con `vite build --base=/transitions-simulator/` y despliega automáticamente en **GitHub Pages** únicamente cuando se hace push a `main`.
* **Regla de Oro:** **NUNCA** desarrollar directamente sobre `main` sin pasar por `dev`.

---

## 🎨 3. Arquitectura Visual y Referencias Mockup
En la carpeta `docs/mockups/` se encuentran los dos diseños de referencia aprobados:

1. **`docs/mockups/portada-landing-mockup.jpg` (Portada / Bienvenida):**
   - **Avatar Hero:** Avatar 3D en **primer plano grande**, centrado y expresivo.
   - **Gafas reactivas:** Lleva puestas las gafas con tintado fotosensible.
   - **Micro-expresiones vivas:** Pestañeo aleatorio, sonrisa, asombro.
   - **Branding:** "Luminix by Visiometric Labs" en cabecera izquierda.
   - **Botón Central CTA:** "INICIAR EXPERIENCIA" (lanza la pantalla completa nativa y pasa a la cabina).

2. **`docs/mockups/interfaz-experiencia-mockup.jpg` (Cabina de Simulación):**
   - **Visión Principal 1ra Persona (POV):** Visión en primera persona a través de la montura hacia la escena activa. El interior del lente atenúa la luz con el tinte activo, mientras que fuera del marco la visión periférica es clara.
   - **Selector Lateral Izquierdo por Familias de Color:**
     - 🟣 **Signature Gen S:** Botones morados.
     - 🟠 **XTRActive:** Botones ámbar/dorados.
     - 🔵 **Style Mirrors:** Botones azul zafiro eléctrico.
     - ⚪ **Standard Generic (Trinity):** Botón gris platino neutro.
   - **Avatar Mediano Integrado (Esquina inferior derecha):** El avatar que estaba grande en la portada se encoge suavemente y se aloja en una tarjeta de vidrio translúcido en tamaño mediano, portando las mismas gafas y haciendo expresiones continuas y aplausos.
   - **Medidor Superior de Intensidad (Read-Only):** Barra/HUD que indica la absorción solar (ej: `88% Absorción - Cat. 3 Sol Intenso`) y el índice UV (ej: `UV 9.2`). **NO es arrastrable ni modificable por el usuario; varía automáticamente.**
   - **Conmutador de Escenas (Superior derecha):** Píldora para alternar entre "Parque Familiar" y "Museo de Arte".

---

## ⚙️ 4. Reglas de Negocio y Lógica Clínica

1. **Las 2 Escenas Fijas:**
   - **Escena 1: Parque Familiar (Exterior Soleado):** Alta radiación UV. Provoca oscurecimiento solar cinético en tiempo real (~3 a 3.5 segundos).
   - **Escena 2: Dentro de un Museo (Interior Tenue):** Ausencia de UV. Provoca aclarado progresivo (*fade-back*) a transparente.
2. **Persistencia del Lente entre Escenas:**
   - Al conmutar de Parque a Museo o viceversa, **el lente seleccionado NO cambia**.
   - Lo que cambia es el nivel de absorción solar / tinte, transformándose cinéticamente tanto en la vista POV como en el avatar.
3. **Modo Kiosco / Temporizador de Inactividad:**
   - Temporizador de **5 minutos (300.000 ms)** sin interacción del usuario.
   - Al cumplirse, la aplicación regresa suavemente a la Portada (el avatar vuelve a tamaño grande central y el sistema se resetea a estado limpio).

---

## 👤 5. Especificaciones del Avatar 3D
* **Plataforma de generación del modelo:** [Ready Player Me](https://readyplayer.me)
* **Formato:** Archivo `.glb` estándar con huesos humanoides y blendshapes ARKit.
* **Animaciones corporales:** Mixamo Rig (animación de aplauso `clapping`, `idle` con respiración, `cheering`).
* **Micro-expresiones continuas:**
  - Parpadeo aleatorio (`eyeBlinkLeft`, `eyeBlinkRight`) cada 3-5s.
  - Sonrisa / Alegría (`mouthSmileLeft`, `mouthSmileRight`).
  - Cara de sorpresa / Asombro (`browInnerUp`, `jawOpen`).
* **Montura de las gafas:** Gafas 3D vinculadas al hueso `Head` del esqueleto, con cristales PBR cuyo color, opacidad y reflectividad se actualizan con el estado global de la simulación.

---

## 🛠️ 6. Stack Tecnológico Previsto para el Desarrollo
* **Bundler & Dev Server:** Vite (`npm run dev`, `npm run build`).
* **Motor 3D:** Three.js (`GLTFLoader`, `AnimationMixer`).
* **Estilos:** CSS Modular con estética *Dark Glass Cyber-Clínica* (`#070B14`, microbordes traslúcidos `rgba(255,255,255,0.08)`, tipografía sans-serif de alta nitidez).
* **Gestor de Estado:** Máquina de estados desacoplada / Bus de eventos.

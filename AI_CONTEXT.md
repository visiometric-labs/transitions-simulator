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
* **Plataformas de referencia evaluadas:** Ready Player Me y Hyper3D (ChatAvatar).
* **Formato:** Archivo estático y/o `.glb` con blendshapes ARKit.
* **Comportamiento en la aplicación:**
  - En Portada: Renderizado hero en primer plano centrado con micro-animación de respiración viva.
  - En Cabina: Widget en esquina inferior derecha como mini-espejo en tiempo real con tintado dinámico sincronizado y reacciones de aplauso (`clapping`) al activar lentes.

---

## 🛠️ 6. Stack Tecnológico
* **Bundler & Dev Server:** Vite (`npm run dev`, `npm run build`).
* **Estilos:** CSS Modular con estética *Dark Glass Cyber-Clínica* (`#070B14`, microbordes traslúcidos `rgba(255,255,255,0.08)`, tipografía sans-serif de alta nitidez *Plus Jakarta Sans*).
* **Gestor de Estado y Cinemática:** Motor desacoplado a 60 FPS con EventBus.

---

## 🚀 7. Estado Actual de la Implementación (Progreso Registrado)

A fecha de hoy, la base de la aplicación se encuentra **100% funcional, compilada y probada**:

1. **Entorno Base y Configuración:**
   - `package.json`, `vite.config.js` e `index.html` configurados.
   - Soporte para base path dinámico (`/transitions-simulator/` en GitHub Pages).
2. **Escenas y Recursos Visuales:**
   - `public/scenes/parque-familiar.jpg`: Parque exterior soleado de alta resolución (UV 9.2).
   - `public/scenes/museo-arte.jpg`: Museo interior arquitectónico con luz tenue (UV 0.1).
   - `public/avatar/avatar-hero.jpg` y `public/avatar/avatar-clapping.jpg`: Modelos del avatar hero y aplauso.
   - `public/branding/favicon.svg` y `public/manifest.json`.
3. **Núcleo Lógico y Datos Clínicos:**
   - `src/core/event-bus.js`: Sistema de eventos desacoplado (`on`, `off`, `emit`).
   - `src/core/lenses-data.js`: Definición de las 4 familias tecnológicas (Gen S, XTRActive, Mirrors, Generic) con coeficientes de absorción, RGBs de tinte y velocidades de activación.
   - `src/core/simulator-state.js`: Estado reactivo global, persistencia de lente entre escenas y temporizador modo Kiosco (5 min).
   - `src/core/kinetic-engine.js`: Motor de cálculo cinético continuo a 60 FPS para absorción e índice UV.
4. **Visor POV y Escenas:**
   - `src/scenes/scene-manager.js`: Transición crossfade entre Parque y Museo con resplandor periférico de sol directo.
   - `src/components/glasses-pov.js`: Montura Wayfarer vectorial con cristales independientes (máscaras clipPath SVG), atenuación fotópica, tinte multiplicativo, destello espejo y micro-paralaje al mover el cursor.
5. **Componentes HUD y Cyber-Glass:**
   - `src/components/landing-screen.js`: Portada Hero con avatar grande, retículas, gráficos de curva, y botón CTA neón con fullscreen.
   - `src/components/hud-header.js`: Cabecera con branding, medidor dinámico read-only de absorción/categoría (`88% Absorción - Cat. 3 Sol Intenso`) y conmutador de escenas.
   - `src/components/lens-selector.js`: Selector lateral por familias morada, ámbar, azul y gris.
   - `src/components/avatar-widget.js`: Mini-espejo reactivo con tintado sincronizado y aplausos.
6. **Compilación de Producción:**
   - Verificada exitosamente con `npx vite build --base=/transitions-simulator/` en 363ms.

---

## 📋 8. Próximos Pasos para la Siguiente Sesión

1. **Revisión y feedback del usuario** sobre la estética y tiempos cinéticos.
2. **Opcional - Importación de modelo `.glb` con Three.js:** Si el usuario descarga un avatar 3D `.glb` desde Ready Player Me o Hyper3D, se puede sustituir la capa de imagen reactiva por un canvas Three.js con `GLTFLoader` y animación esquelética.
3. **Pruebas en dispositivo táctil / tablet de consulta optométrica.**
4. **Merge a `main`:** Cuando el usuario dé el visto bueno final, combinar de `dev` a `main` para despliegue automático en GitHub Pages.

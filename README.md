# Luminix™ by Visiometric Labs 🕶️✨
> **Simulador Clínico Interactivo de Lentes Fotosensibles Transitions® y Probador Facial 3D en Mostrador**  
> Desarrollado por **JayzirTech** para **Visiometric Labs**.

[![Despliegue GitHub Pages](https://github.com/visiometric-labs/transitions-simulator/actions/workflows/deploy.yml/badge.svg)](https://visiometric-labs.github.io/transitions-simulator/)
[![Demo En Vivo](https://img.shields.io/badge/Demo%20En%20Vivo-GitHub%20Pages-38BDF8?style=flat&logo=github)](https://visiometric-labs.github.io/transitions-simulator/)

<p align="center">
  <img src="public/branding/og-card-whatsapp.png" alt="Luminix™ by Visiometric Labs • JayzirTech" width="100%" style="border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</p>

---

## 🎯 Descripción General

**Luminix** es una plataforma clínica de simulación óptica en primera persona (POV) y probador virtual facial en 3D en tiempo real, diseñada específicamente para ópticas, consultorios optométricos y mostradores de atención a pacientes.

Permite al paciente experimentar de forma vívida e interactiva la diferencia entre la visión al descubierto (deslumbrada por la radiación solar y la luz artificial) y la protección visual inteligente de las lentes fotosensibles **Transitions®** (*Signature Gen S™*, *XTRActive® Polarized*, *Style Mirrors™* y comparativa con estándar).

---

## 🔬 Capacidades Clínicas y Tecnológicas Destacadas

### 1. Visión en Primera Persona (POV) con Comparativa de Deslumbramiento
- **Visión al Descubierto (Sin Gafas)**: Implementa un motor óptico multinivel de 4 capas con sobreexposición natural (50,000+ lux), resplandor fotónico (*bloom* corneal), puntos calientes especulares (*hotspots* con `color-dodge`) y velo solar cegador (*veiling glare* y rayos volumétricos).
- **Visión a Través del Cristal (Transitions®)**: Elimina el deslumbramiento cegador, reduce la luminancia a un nivel descansado, restaura el contraste cromático de los detalles y aplica el tintado cinético activo con reflejos antirreflejo Crizal y espejos flash.
- **Navegación Interactiva de la Mirada (Gaze POV) con Cinemática Fisiológica**: El paciente puede arrastrar con el dedo o ratón, o usar teclado (WASD/flechas), con una cinemática de rotación de cuello humano inspirada en la física de *Filters-Simulator*:
  - **Física de Cuello Real**: Ángulos Yaw (giro horizontal ~±45°) y Pitch (inclinación vertical ~+36° / -40°) con amortiguación exponencial independiente del framerate (60-120+ FPS).
  - **Inercia Táctil (Momentum Fling)**: Al soltar el dedo o ratón, la mirada continúa deslizándose suavemente con fricción progresiva.
  - **Sin Joystick Virtual**: Manipulación 100% directa en la escena con un dedo o puntero, manteniendo una pantalla limpia para mostrador.
  - **Mirar hacia Arriba**: Permite mirar directamente por encima de la montura al sol deslumbrante sin filtro.
  - **Mirar al Centro**: El paciente vuelve a cubrir su línea de visión con el lente fotosensible, experimentando el confort inmediato.
  - **Mirar a los Lados**: Comparativa directa de visión periférica descubierta vs. visión central protegida.
  - **Sincronización Óptica Unificada al Sub-Píxel**: Fondo exterior (`SceneManager`) e interior (`GlassesPOV`) unificados en proyección SVG idéntica (`viewBox 1920x1080 preserveAspectRatio="xMidYMid slice"`) con los mismos límites de encuadre (`width="2240" height="1250"`). El mundo exterior y el mundo filtrado interior comparten exactamente el mismo paneo (`worldPanX = -gazeX * 120`, `worldPanY = -gazeY * 70`), eliminando cualquier corte, retraso de 80ms o salto de escala al atravesar el borde del cristal.
  - **Recentrado Inmediato**: Botón flotante dinámico y doble toque/clic para volver al centro.

### 2. Avatar Facial 3D Real (Three.js + WebGL)
- **Modelo 3D Integrado (`avatar.glb`)**: Esqueleto óseo completo con articulación facial y *morph targets* de parpadeo involuntario fisiológico y sonrisa.
- **Movimiento Autónomo Natural (Talking Cat style)**: El avatar no sigue mecánicamente el cursor; tiene comportamientos y miradas autónomas donde mirar al frente es la orientación predominante y más prolongada (~70% del tiempo).
- **Separación de Marco vs. Cristal**: La montura (`Wolf3D_Glasses`) se mantiene en un elegante acabado de acetato negro satinado permanente que **jamás cambia de color**, mientras que mallas físicas dedicadas (`THREE.SkinnedMesh` con `MeshPhysicalMaterial`) modulan exclusivamente el tintado óptico, transmisión y reflejo espejo del cristal.

### 3. Escenarios Clínicos y Transición de 200 ms
- **Parque Familiar (Exteriores Soleados)**: Radiación UV 9.2 con oscurecimiento solar cinético en tiempo real (~25 s).
- **Museo de Arte (Interiores con Luz Controlada)**: UV 0.1 con aclarado acelerado progresivo (*fade-back*).
- **Transición Sincronizada de 200 ms**: Al conmutar escenarios, tanto el fondo panorámico como la imagen proyectada dentro de los cristales transicionan simultáneamente en exactamente 200 ms.

### 4. Portada Clínica Institucional
- Eliminación de elementos decorativos inertes.
- Tarjetas de especificación clínica de la tecnología *Transitions® Gen S™* y la *Cabina en Mostrador*.
- Botón de pantalla completa condicional (solo aparece el botón de salir cuando el navegador ya está en pantalla completa).
- Derechos de autor institucionales: *© 2026 JayzirTech. Todos los derechos reservados. • Luminix by Visiometric Labs*.

---

## 👓 Familias Oftálmicas Disponibles

| Familia | Tonalidades | Características Principales |
| :--- | :--- | :--- |
| **Signature Gen S™** | Rubí, Zafiro, Amatista, Esmeralda, Ámbar | Dinámica cinética ultrarrápida (25 s), claridad cristalina en interiores, 100% protección UV y luz azul. |
| **XTRActive® Polarized** | Gris Polarizado, Grafito Verde | Máxima protección solar y fotoprotección en cabina de automóvil con corte de reflejos horizontales. |
| **Style Mirrors™** | Azul Flash, Plata Flash, Oro Flash | Recubrimiento de espejo moderno en exteriores que se atenúa a un brillo sutil en interiores. |
| **Monofocal Estándar** | Fotocromático Básico | Lente tradicional con activación estándar para comparativa pedagógica frente a Gen S. |

---

## 🎨 Identidad Visual y Recursos Gráficos

El proyecto incorpora un sistema de branding e identidad visual de grado óptico clínico, con activos listos para redes sociales, WhatsApp y plataformas de mensajería:

| Recurso | Archivo | Dimensiones | Uso y Descripción |
| :--- | :--- | :--- | :--- |
| **Banner Social / WhatsApp Card** | [`public/branding/og-card-whatsapp.png`](file:///c:/Users/jayzi/OneDrive/Desktop/JayzirTech/Proyecto%20Ópticas/transitions-simulator/public/branding/og-card-whatsapp.png) | 1200 × 630 px | Tarjeta enriquecida para previsualización en WhatsApp, Open Graph, Facebook, LinkedIn y Twitter Card. Incluye la montura oftálmica luminiscente, retícula óptica y tipografía institucional. |
| **Foto de Perfil Institucional** | [`public/branding/profile-picture.png`](file:///c:/Users/jayzi/OneDrive/Desktop/JayzirTech/Proyecto%20Ópticas/transitions-simulator/public/branding/profile-picture.png) | 1024 × 1024 px | Avatar cuadrado de alta fidelidad para perfiles corporativos de Visiometric Labs y JayzirTech. |
| **Isotipo Vectorial (Favicon)** | [`public/branding/favicon.svg`](file:///c:/Users/jayzi/OneDrive/Desktop/JayzirTech/Proyecto%20Ópticas/transitions-simulator/public/branding/favicon.svg) | SVG vectorial | Isotipo con retículos circulares concéntricos, líneas de mira y montura geométrica en cian eléctrico y blanco puro. |

<p align="center">
  <img src="public/branding/og-card-whatsapp.png" alt="Tarjeta Social WhatsApp Luminix" width="75%" style="border-radius: 12px; margin: 12px 0; box-shadow: 0 8px 24px rgba(0,0,0,0.4);" />
</p>

---

## 🛠️ Stack Tecnológico

- **Entorno & Bundler:** [Vite](https://vitejs.dev/) + Vanilla JavaScript ES Modules.
- **Motor 3D:** [Three.js](https://threejs.org/) (GLTFLoader, SkinnedMesh, MeshPhysicalMaterial, ACESFilmicToneMapping).
- **Gráficos Vectoriales & POV:** SVG binocular panorámico con doble pase óptico y máscaras de recorte dinámicas.
- **Arquitectura de Eventos:** EventBus desacoplado y máquina de estados global reactiva.
- **Modo Kiosco:** Temporizador de inactividad de 5 minutos con retorno automático a la portada.
- **CI/CD:** GitHub Actions con despliegue automatizado a GitHub Pages.

---

## 🌿 Flujo Git y Ramas

- **`dev`**: Rama de desarrollo activo (todas las mejoras y cambios se realizan aquí).
- **`main`**: Rama de producción estable vinculada al despliegue automático de GitHub Pages.

---

## 🏢 Autoría y Licencia

- **Organización:** Visiometric Labs
- **Desarrollo y Arquitectura:** JayzirTech
- **Tecnología de Referencia:** Transitions Optical / EssilorLuxottica

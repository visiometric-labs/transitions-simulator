# Transitions Simulator (Luminix) by Visiometric Labs 🕶️✨

Simulador clínico y probador interactivo de lentes fotosensibles (**Transitions®** y comparativa con estándar) en primera persona (POV) con avatar integrado reactivo en tiempo real.

---

## 🎯 Resumen de Arquitectura y Especificaciones
- **Nombre de Marca:** Luminix by Visiometric Labs
- **Repositorio:** [transitions-simulator (GitHub)](https://github.com/visiometric-labs/transitions-simulator.git)
- **Flujo del Avatar 3D:**
  - **En Portada:** Avatar 3D en **tamaño grande**, con micro-expresiones aleatorias vivas (parpadeo, sorpresa, felicidad, respiración).
  - **En la Experiencia:** Transiciona suavemente a **tamaño mediano** en una tarjeta/widget integrado en la misma pantalla.
  - **Animaciones y Reacciones:** Compatible con Ready Player Me `.glb` + Mixamo (aplauso, felicidad, asombro al activarse la lente).
- **Escenas fijas:**
  1. **Parque en plan familiar** (Exterior soleado, radiación UV alta).
  2. **Dentro de un museo** (Interior tenue, iluminación controlada).
- **Selector Izquierdo por Familias:** Botones agrupados y coloreados por familia (Signature Gen S / Gen 8, XTRActive, Style Mirrors, Fotocromático Estándar).
- **Cinética Dinámica:** Al conmutar escenas, el lente activo se conserva y la intensidad de oscurecimiento transiciona suavemente en la 1ra persona y en el avatar.
- **Medidor de Intensidad:** Indicador visual dinámico (read-only, no modificable por el usuario).
- **Modo Kiosco:** Temporizador de inactividad de **5 minutos** con retorno automático a la portada.
- **Estrategia de Ramas:**
  - `dev`: Rama predeterminada de desarrollo.
  - `main`: Rama de despliegue exclusivo a GitHub Pages.

Para consultar el documento completo, ver [CONCEPT.md](file:///c:/Users/jayzi/OneDrive/Desktop/JayzirTech/Proyecto%20Ópticas/transitions-simulator/CONCEPT.md).

---

## 🏢 Autoría y Licencia
- **Organización:** Visiometric Labs
- **Autor:** JayzirTech

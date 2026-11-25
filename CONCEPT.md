# 🕶️ Luminix by Visiometric Labs
> **Simulador Interactivo y Probador Clínico de Lentes Fotosensibles y Tecnología Transitions**
> *Repositorio Oficial:* `https://github.com/visiometric-labs/transitions-simulator.git`  
> *Carpeta de Proyecto:* `transitions-simulator`  
> *Organización:* Visiometric Labs | *Autoría:* JayzirTech

---

## 🎯 1. Resumen Ejecutivo y Especificaciones Acordadas

**Luminix** es una aplicación clínica interactiva diseñada para consulta optométrica y mostrador de ventas, cuyo propósito es demostrar la tecnología de lentes fotosensibles (**Transitions®** y comparativa con estándar) eliminando las dudas visuales y estéticas del paciente en una sola experiencia fluida.

---

## 🖼️ 2. Arquitectura de Pantalla y Composición Visual

### 2.1 Vista Integrada Simultánea (POV + Avatar en la misma pantalla)
A diferencia de simuladores convencionales que obligan al usuario a alternar pestañas:
1. **Visión Principal en 1ª Persona (POV):**
   * El paciente mira a través de los lentes hacia el escenario activo.
   * Renderizado cinemático con marco de montura y visión periférica exterior comparativa.
2. **Avatar Mediano Integrado (Mini-Espejo / Vista en 3ª Persona):**
   * Ubicado en un cuadrante visible y elegante de la pantalla (widget/tarjeta flotante).
   * Muestra un avatar con las gafas puestas.
   * **Reacción en tiempo real:** Los cristales de las gafas del avatar adoptan el mismo color, tonalidad y porcentaje de oscurecimiento seleccionado, permitiendo evaluar cómo luce el lente sobre el rostro al mismo tiempo que se experimenta la visión POV.

---

## 🌄 3. Escenas Clínicas del Entorno

La experiencia cuenta con **2 escenas fijas de alto contraste lumínico**:

1. **🌳 Escena 1: Parque en Plan Familiar (Exterior Soleado)**
   * Alta radiación solar y rayos UV.
   * La lente alcanza su máxima profundidad de oscurecimiento y absorción de luz.
   * Resalta la comodidad frente al deslumbramiento y la protección estética como gafa de sol.

2. **🏛️ Escena 2: Dentro de un Museo (Interior con Luz Tenue)**
   * Iluminación artificial controlada, ausencia de radiación UV directa.
   * La lente inicia su proceso de aclarado (*fade-back*) hasta recuperar la transparencia total.
   * Resalta la claridad óptica y la ausencia de tinte residual bajo techo.

---

## 🎛️ 4. Mecánica de Navegación y Controles

### 4.1 Selector de Lentes (Lateral Izquierdo)
* Ubicado verticalmente en el **costado izquierdo** de la interfaz.
* **Agrupación visual por Familias de Generación:**
  * Los botones se organizan por familias tecnológicas.
  * **Cada familia tiene su propio color temático distintivo** en sus botones para una identificación inmediata y limpia:
    * 🟣 **Familia Transitions Signature (Gen 8 / Gen S):** Color distintivo A. (Activación y retorno ultra rápidos, máxima versatilidad cotidiana).
    * 🟠 **Familia Transitions XTRActive:** Color distintivo B. (Activación extra en exteriores y reacción a luz visible tras el parabrisas de vehículos).
    * 🔵 **Familia Transitions Style Mirrors:** Color distintivo C. (Espejados de moda: Azul Zafiro, Plata, Bronce/Oro).
    * ⚪ **Familia Fotocromático Genérico (Trinity / Estándar):** Color neutro / gris de contraste. (Muestra la activación más lenta y el tope limitado en Cat. 2).

### 4.2 Persistencia del Lente al Cambiar de Escena
* Cuando el usuario cambia de escena (de Parque a Museo o viceversa):
  * **El lente seleccionado NO cambia** (se conserva la selección actual).
  * **La intensidad de oscurecimiento se transforma dinámicamente:**
    * Si pasa del Parque al Museo: el cristal se va aclarando gradualmente frente a los ojos del paciente y en el avatar.
    * Si pasa del Museo al Parque: el cristal se va oscureciendo según la curva cinética del lente activo.

### 4.3 Medidor / Slider de Intensidad Dinámico (Read-Only)
* Un indicador visual (barra / slider / HUD) que muestra en tiempo real el porcentaje de oscuridad y la categoría óptica (Cat. 0 a Cat. 3).
* **Comportamiento:**
  * **Es variable:** Su valor sube o baja automáticamente siguiendo la física del cristal en la escena activa.
  * **NO es modificable por el usuario:** Es un medidor pasivo que refleja el estado real del lente, garantizando una demostración clínica fidedigna y libre de manipulaciones confusas.

---

## 👤 5. Implementación del Avatar

Para generar el avatar con sus gafas a partir de una fotografía:
1. **Modelo Facial:** Rostro representativo con orientación frontal/tres cuartos.
2. **Gafas Fotocromáticas Reactivas:** Lentes que reciben el tinte, la opacidad y los reflejos calculados por el motor cinético.
3. **Flujos de Integración según la Foto del Usuario:**
   * **Flujo 3D (Three.js):** Carga de modelo `.glb` optimizado generado a partir de la foto con gafas 3D paramétricas superpuestas.
   * **Flujo 2.5D Hiperrealista (Canvas/SVG):** Fotografía del paciente con máscara vectorial de cristales ópticos donde se renderizan capas de absorción lumínica, reflejo especular y coloración en tiempo real a 60 FPS.

---

## 🚀 6. Configuración de Repositorio

* **URL Remota:** `https://github.com/visiometric-labs/transitions-simulator.git`
* **Rama Principal:** `main`
* **Licencia & Créditos:** JayzirTech / Visiometric Labs

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

### 2.1 Portada / Bienvenida (Hero Landing Screen)
* **Avatar Protagonista en Tamaño Grande:**  
  * Al iniciar la aplicación, el avatar 3D aparece en primer plano (tamaño grande/hero).
  * Lleva puestas las gafas y realiza micro-expresiones aleatorias continuas (parpadeos, sonrisas, gestos de bienvenida o asombro).
  * Invita al paciente a pulsar el botón central **"Iniciar Experiencia"** / Pantalla Completa.
  * **Referencia visual:** `docs/mockups/portada-landing-mockup.jpg`

### 2.2 Transición Cinemática hacia la Experiencia
* Al presionar "Iniciar Experiencia":
  * El avatar transiciona suavemente de tamaño grande en portada a **tamaño mediano**, ubicándose en su tarjeta/widget interactivo flotante en una esquina de la cabina.
  * Se abre la visión en 1ra persona (POV) del escenario activo.

### 2.3 Vista Integrada Simultánea (POV + Avatar en la misma pantalla)
* **Visión Principal en 1ª Persona (POV):**
  * El paciente mira a través de los lentes hacia el escenario activo (Parque o Museo).
  * Renderizado cinemático con marco de montura y visión periférica exterior comparativa.
* **Avatar Mediano Integrado (Mini-Espejo / Vista en 3ª Persona):**
  * Ubicado en un cuadrante visible y elegante de la pantalla (widget/tarjeta flotante).
  * Muestra al avatar con las gafas puestas (aplaudiendo, sonriendo o reaccionando a la luz).
  * **Reacción en tiempo real:** Los cristales de las gafas del avatar adoptan el mismo color, tonalidad y porcentaje de oscurecimiento seleccionado, permitiendo evaluar cómo luce el lente sobre el rostro al mismo tiempo que se experimenta la visión POV.
  * **Referencia visual:** `docs/mockups/interfaz-experiencia-mockup.jpg`

---

## 👤 3. Motor de Comportamiento y Expresiones del Avatar 3D

Para lograr que el avatar se sienta completamente vivo, dinámico y humano:
1. **Bucle de Expresiones Aleatorias Continuas:**
   * **Parpadeo natural (*Blink*):** Pestañeo involuntario cada 3 a 5 segundos con micro-variaciones de frecuencia.
   * **Expresiones faciales combinadas (Blendshapes / Morph Targets de Ready Player Me):**
     * **Cara de sorpresa:** Cejas elevadas (`browInnerUp`), apertura de ojos y boca en 'O' (`jawOpen`).
     * **Cara de felicidad / satisfacción:** Sonrisa natural (`mouthSmileLeft`, `mouthSmileRight`), achinamiento de ojos de agrado.
     * **Micro-movimientos de cabeza:** Leves ladeos, giros sutiles de mirada (*eye tracking* o *look around*).
2. **Reacciones Contextuales y Animaciones Corporales (Mixamo Rig):**
   * **Aplausos / Celebración (*Clapping*):** El avatar puede aplaudir o sonreír con satisfacción cuando el paciente prueba un lente y observa la rapidez del oscurecimiento solar.
   * **Respiración y postura viva en reposo (*Idle Breathing*):** Evita cualquier efecto de rigidez o estatua.

---

## 🌄 4. Escenas Clínicas del Entorno

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

## 🎛️ 5. Mecánica de Navegación y Controles

### 5.1 Selector de Lentes (Lateral Izquierdo)
* Ubicado verticalmente en el **costado izquierdo** de la interfaz.
* **Agrupación visual por Familias de Generación:**
  * Los botones se organizan por familias tecnológicas.
  * **Cada familia tiene su propio color temático distintivo** en sus botones para una identificación inmediata y limpia:
    * 🟣 **Familia Transitions Signature (Gen 8 / Gen S):** Color distintivo A. (Activación y retorno ultra rápidos, máxima versatilidad cotidiana).
    * 🟠 **Familia Transitions XTRActive:** Color distintivo B. (Activación extra en exteriores y reacción a luz visible tras el parabrisas de vehículos).
    * 🔵 **Familia Transitions Style Mirrors:** Color distintivo C. (Espejados de moda: Azul Zafiro, Plata, Bronce/Oro).
    * ⚪ **Familia Fotocromático Genérico (Trinity / Estándar):** Color neutro / gris de contraste. (Muestra la activación más lenta y el tope limitado en Cat. 2).

### 5.2 Persistencia del Lente al Cambiar de Escena
* Cuando el usuario cambia de escena (de Parque a Museo o viceversa):
  * **El lente seleccionado NO cambia** (se conserva la selección actual).
  * **La intensidad de oscurecimiento se transforma dinámicamente:**
    * Si pasa del Parque al Museo: el cristal se va aclarando gradualmente frente a los ojos del paciente y en el avatar.
    * Si pasa del Museo al Parque: el cristal se va oscureciendo según la curva cinética del lente activo.

### 5.3 Medidor / Slider de Intensidad Dinámico (Read-Only)
* Un indicador visual (barra / slider / HUD) que muestra en tiempo real el porcentaje de oscuridad y la categoría óptica (Cat. 0 a Cat. 3).
* **Comportamiento:**
  * **Es variable:** Su valor sube o baja automáticamente siguiendo la física del cristal en la escena activa.
  * **NO es modificable por el usuario:** Es un medidor pasivo que refleja el estado real del lente, garantizando una demostración clínica fidedigna y libre de manipulaciones confusas.

---

## ⏱️ 6. Temporizador de Inactividad (Modo Kiosco / Gabinete Clínico)

* **Retorno Automático a Portada (5 Minutos):**
  * Si la pantalla no registra toques, clics ni movimiento de ratón durante **5 minutos (300.000 ms)**, la aplicación realiza un retorno suave a la portada de bienvenida.
  * **Preservación de Pantalla Completa:** La aplicación permanece en pantalla completa sin salir al regresar automáticamente, asegurando continuidad estética en el mostrador.
  * **Parámetro URL para Pruebas:** Admite `?timeout=2000` para configurar tiempos reducidos de inactividad (ej. 2 segundos) y `?autostart=true` para validación automatizada.
  * **Reinicio de Estado Limpio:**
    * El avatar regresa a su tamaño grande central.
    * La simulación se reinicia en estado transparente inicial (Parque Familiar, amatista, Cat. 0).
    * Garantiza que la tablet o pantalla táctil de la óptica siempre esté lista, atractiva y fresca para el siguiente paciente sin necesidad de reiniciarla manualmente.

---

## 🚀 7. Documentación Bilingüe y Despliegue

* **Documentación en Español:** [`README.md`](README.md)
* **Documentación en Inglés:** [`README_EN.md`](README_EN.md)
* **Especificaciones Técnicas para Desarrolladores:** [`AI_CONTEXT.md`](AI_CONTEXT.md)

---

## 🌿 8. Estrategia de Ramas Git y Despliegue CI/CD

* **Rama por Defecto (`dev`):**
  * Todo el desarrollo diario, pruebas y características se realizan en la rama `dev`.
* **Rama de Producción y Despliegue (`main`):**
  * La rama `main` está reservada exclusivamente para versiones estables listas para producción.
  * El workflow `.github/workflows/deploy.yml` compila con `vite build --base=/transitions-simulator/` y despliega automáticamente a **GitHub Pages** únicamente ante pushes a `main`.

---

*Documento maestro actualizado y sincronizado en el repositorio.*

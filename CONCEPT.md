# 🕶️ Luminix by Visiometric Labs
> **Simulador Interactivo y Probador Clínico de Lentes Fotosensibles y Tecnología Transitions**
> *Desarrollado para consulta optométrica y mostrador de óptica moderna.*

---

## 🎯 1. Visión y Propósito del Proyecto

En la venta de lentes fotosensibles de alta gama (como **Transitions®**), el paciente promedio se enfrenta a dos grandes objeciones psicológicas antes de decidir su compra:

1. **La Objeción Visual (POV - Primera Persona):**
   * *«¿Cómo veré yo a través del lente?»*
   * *«¿Se pondrá demasiado oscuro en interiores? ¿Veré nítido en el computador? ¿Me protegerá realmente del sol en la calle?»*

2. **La Objeción Estética (Tercera Persona - Modo Espejo):**
   * *«¿Cómo me veré yo con las gafas puestas?»*
   * *«¿Se verá extraño el cambio de transparente a oscuro? ¿Parecerá una gafa de sol auténtica o una mica descolorida? ¿Cómo lucen los tonos de moda y espejados en mi rostro?»*

**Luminix** nace para ser la herramienta interactiva definitiva que resuelve ambas dudas en tiempo real frente al paciente, elevando la tasa de conversión en óptica.

---

## 🧭 2. Ejes de Discusión Previos al Desarrollo (Preguntas Clave)

Antes de escribir una sola línea de código, definamos juntos los siguientes aspectos:

### Eje A: La Experiencia Visual Dual (POV vs. Espejo)
- **Modo 1: Visión en 1ª Persona (POV):**
  - ¿Qué escenarios exteriores e interiores queremos ilustrar? (p. ej. *Oficina / Interior con luz tenue*, *Paseo urbano / Terraza bajo sol*, *Conducción detrás del parabrisas*).
  - ¿Deseamos mantener la mecánica de arrastre de cámara / panorámica 360 similar a Chromatis?
- **Modo 2: Visión en 3ª Persona (Modo Espejo / Rostro con Montura):**
  - ¿Cómo renderizaremos el rostro del paciente portando las gafas?
    - *Opción 1 (Ilustración / Render 2D hiperrealista):* Modelos faciales fotorrealistas (masculino/femenino) con monturas vectoriales/fotográficas donde los cristales oscurecen dinámicamente con reflejos.
    - *Opción 2 (Cámara / Webcam en vivo / Filtro WebGL):* Usar la cámara de la tablet/computador para que el paciente se vea a sí mismo (requiere mayor procesamiento y permisos de cámara).
    - *Opción 3 (Compositor de fotos del cliente):* Subir una foto del paciente o elegir un avatar clínico de referencia.

---

### Eje B: Catálogo de Tecnologías y Tratamientos a Comparar
¿Qué lentes y variantes queremos incluir en el selector?
1. **Transitions Signature (Gen 8 / Gen S):**
   - Transparencia total en interiores (Categoría 0) y activación ultrarrápida al sol (Categoría 3, 88% absorción).
2. **Transitions XTRActive (Para conductores):**
   - Lente diseñada para activarse incluso dentro del automóvil (reaccionando a la luz visible a través del parabrisas) y con tinte residual muy suave en interiores.
3. **Transitions Style Colors & Style Mirrors:**
   - Tonos clásicos: *Gris Grafito*, *Café Ámbar*, *Verde Esmeralda/G-15*.
   - Tonos de moda espejados: *Plata (Silver)*, *Azul Zafiro (Blue Mirror)*, *Dorado / Bronce (Gold/Bronze)*.
4. **Fotocromático Genérico (Trinity / Estándar de masa):**
   - Utilizado como lente de comparación para demostrar la lentitud y el tope de oscuridad más bajo (Cat. 2 ~65%) frente a Transitions.

---

### Eje C: Simulación Física y Ambiental
¿Qué variables ambientales queremos que el óptico pueda manipular en pantalla?
- **Radiación Ultravioleta (Índice UV):** De 0 (interior/noche) a 11+ (sol intenso de mediodía).
- **Temperatura Ambiente:** En física de polímeros fotosensibles, el frío acelera la activación y el calor reduce la profundidad máxima. ¿Queremos simular este comportamiento térmico?
- **Fade-Back (Tiempo de Desactivación):** Demostrar la velocidad con la que la lente aclara al regresar bajo techo.

---

### Eje D: Experiencia de Usuario (UI/UX) y Modo Quiosco
- **Hardware Objetivo:** Pantallas táctiles de mostrador, iPads, tablets Android y monitores de consulta.
- **Modo Kiosco Integrado:** Pantalla completa sin barras de navegador, regreso automático a portada tras inactividad (evitando dejar la pantalla congelada entre pacientes).
- **Controles Clínicos:**
  - Botón rápido "Probar Sol / Activar UV".
  - Deslizador de radiación manual para explicaciones paso a paso.
  - Alternador instantáneo entre modo *POV (Mis Ojos)* y *Espejo (Mi Rostro)*.

---

## 🏛️ 3. Estructura de Proyecto Proyectada (Ecosistema Visiometric Labs)

```
Proyecto Ópticas/
├── refraction-simulator/   --> Ocularis (Refracción, Patologías y Anatomía)
├── filters-simulator/      --> Chromatis (Filtros de Luz Azul, Conducción, Antirreflejos)
└── luminix/                --> Luminix (Lentes Fotosensibles y Transitions)
    ├── .git/
    ├── .gitignore
    ├── CONCEPT.md          --> Documento de diseño y acuerdos previos
    └── README.md           --> Guía del proyecto
```

---

*Documento preparado para debate y definición de alcance previo a la fase de maquetación y desarrollo.*

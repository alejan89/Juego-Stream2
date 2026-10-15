# Catamarca Aprende + · Juegos del piloto interdisciplinario

Sitio estático con **tres juegos interactivos**, listo para publicarse en GitHub Pages.
Usa los diseños de **Mora, Mati y Mari** compartidos para este proyecto, sin recurrir a servicios externos ni recopilar datos personales.

## Estructura

- `index.html`: menú para acceder a los tres juegos.
- `juego1/index.html`: Detectives del titular (0:00 a 10:00).
- `juego2/index.html`: Laboratorio: 8 de 10 + inteligencia artificial (10:00 a 24:00).
- `juego3/index.html`: Desafío final, 70 %, justificación y reescritura (24:00 a 30:00).
- `assets/mora.png`, `assets/mati.png`, `assets/mari.png`: retratos de los personajes proporcionados.
- `assets/styles.css`: estilos compartidos.
- `assets/game.js`: motor de interacción de los juegos.

## Identificación del Ministerio

Se incluye `assets/logo-ministerio-original.png`, incorporado a partir del archivo provisto por el usuario con el **logo original del Ministerio de Educación y Trabajo · Catamarca Gobierno**. El proyecto funciona sin dependencia externa y presenta ese logo en el menú principal y en los tres juegos.

## Diseño

Interfaz más juvenil con tarjetas ilustradas por iconos, colores diferenciados por juego (violeta, turquesa y rosa), fondos dinámicos, insignias temáticas, animaciones suaves, alto contraste en consignas, personajes Mora/Mati/Mari y diseño adaptable a celulares. Respeta preferencia de movimiento reducido.

## Publicación en GitHub Pages

1. Extraé el ZIP en tu computadora.
2. Creá un repositorio en GitHub, o usá uno existente.
3. Subí **el contenido de esta carpeta** a la raíz del repositorio (el archivo `index.html` debe quedar en la raíz).
4. En GitHub abrí **Settings > Pages**. En **Build and deployment** elegí **Deploy from a branch**, seleccioná `main` y la carpeta **/(root)** y guardá.
5. Cuando termine la publicación, entrá al enlace de GitHub Pages. Desde el menú podés ingresar a los tres juegos; también funcionan las URL `/juego1/`, `/juego2/`, `/juego3/`.

## Uso sin conexión

Podés abrir `index.html` directamente desde tu computadora o pantalla de streaming; los juegos son HTML, CSS y JavaScript estáticos y no requieren conexión a internet.

## Criterios pedagógicos

- La votación inicial es **provisoria y no calificada**.
- La cuenta `8/10 = 0,8 = 80 %` es válida para las personas consultadas y por sí sola no prueba preferencias de toda Catamarca.
- Un texto de IA puede sonar convincente, pero debe verificarse antes de difundirlo.
- El desafío final usa un ejemplo ficticio de `7/10 = 70 %`: la respuesta esperada es que el cálculo es correcto, pero no se debe generalizar a todos los jóvenes.
- En las pantallas no se muestran letras A/B/C ni se revelan respuestas antes de la interacción.
- Las decisiones y textos que escriben los participantes permanecen en el navegador local; no hay envío a servidores.
- Los juegos tienen orientaciones docentes desplegables y navegación entre bloques.

## Nota para producción

El piloto de 30 minutos se facilita con mediación estudiantil y docente: los tiempos que aparecen en cada juego son referencias del guion, **no cronómetros automáticos**.
Las elecciones de un solo navegador no equivalen a una votación anónima conjunta de toda una audiencia conectada. Para votaciones masivas en vivo necesitás una herramienta externa que reciba respuestas de la audiencia.

## Créditos

Proyecto: **Catamarca Aprende +**. Personajes institucionales: **Mora, Mati y Mari**, a partir de las láminas aportadas para el proyecto.

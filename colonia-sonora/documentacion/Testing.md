# Informe técnico de testing — Colonia Sonora

**Fecha de ejecución:** 28 de octubre de 2026  
**Entorno:** aplicación local con Vite, navegador integrado y Node.js 22  
**Alcance:** filtrado de lugares por categoría y presentación de videos de
YouTube asociados a un lugar.

## 1. Objetivo

Verificar dos funcionalidades implementadas en Colonia Sonora mediante pruebas
de caja negra y caja blanca, registrar resultados observados y proponer mejoras.
Las pruebas se realizaron sobre el catálogo que cargó la aplicación durante la
sesión; el contenido de Supabase puede cambiar y, por lo tanto, también los
nombres y cantidades observados.

## 2. Fundamentación teórica

### Pruebas de caja negra

Evalúan el comportamiento del sistema desde la perspectiva del usuario, usando
entradas y observando salidas sin depender de cómo está escrito el código. En
este informe se utilizaron para accionar los filtros de la interfaz y para
comprobar si la selección de un lugar presenta su video.

### Pruebas de caja blanca

Evalúan la estructura interna de una unidad de código. Se identifican
condiciones, decisiones y caminos posibles, y se diseñan entradas para
ejercitarlos. En este informe se analizó y ejecutó la función
`getYouTubeEmbedUrl` de `src/Components/PlaceDetails.jsx`, que acepta enlaces
compatibles y produce una URL de inserción o `null`.

## 3. Funcionalidades seleccionadas

### F1 — Filtrado de lugares por categoría

La sección de exploración permite mostrar todos los lugares o filtrar por
canciones, videoclips y artistas. Al cambiar el filtro, la interfaz actualiza la
lista, la cantidad mostrada y el lugar seleccionado.

### F2 — Conversión y presentación de videos de YouTube

El panel de lugar analiza primero el enlace multimedia del lugar, luego el de la
canción y finalmente el detalle del lugar. Para URLs de YouTube compatibles,
`getYouTubeEmbedUrl` genera una dirección `youtube-nocookie.com/embed/...`; el
componente la muestra en un `iframe`.

## 4. Condiciones de ejecución

- Se inició la aplicación con `npm run dev -- --host 127.0.0.1`.
- Se abrió `http://127.0.0.1:5173/` en el navegador integrado.
- La aplicación cargó el catálogo disponible en el entorno: 11 lugares, con 7
  canciones, 2 videoclips y 2 artistas.
- Los datos y las URLs de medios dependen de Supabase y de servicios externos.
  Los resultados del catálogo son una observación de esta ejecución, no datos
  fijos de prueba.
- Para caja blanca, se ejecutó en Node.js la implementación de la función
  extraída del archivo fuente, sin modificarla. Los casos verificaron sus
  resultados de retorno.

## 5. Matriz de pruebas de caja negra

| ID | Objetivo | Datos de entrada | Procedimiento | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|
| BB-01 | Ver todos los lugares | Filtro **Todos los lugares** | Abrir la exploración y activar el filtro | La lista muestra todos los lugares cargados; el contador coincide con la lista | Se observaron 11 lugares y contador `11` | Aprobada |
| BB-02 | Filtrar canciones | Filtro **Canciones** | Activar el filtro y observar la lista y el contador | Mostrar solo lugares de categoría canción; contador coincidente | Se observaron 7 resultados y contador `7` | Aprobada |
| BB-03 | Filtrar videoclips | Filtro **Videoclips** | Activar el filtro y observar la lista y el contador | Mostrar solo videoclips; contador coincidente | Se observaron 2 resultados: Rambla de Colonia y Real de San Carlos; contador `2` | Aprobada |
| BB-04 | Filtrar artistas | Filtro **Artistas** | Activar el filtro y observar la lista y el contador | Mostrar solo artistas; contador coincidente | Se observaron 2 resultados: El General y Faro de Colonia; contador `2` | Aprobada |
| BB-05 | Comprobar actualización de selección | Cambiar de **Todos** a **Artistas** | Activar el filtro de artistas y revisar el panel seleccionado | El filtro queda activo y se selecciona un lugar perteneciente a esa categoría | El botón quedó marcado como activo; el panel mostró El General como artista seleccionado | Aprobada |
| BB-06 | Verificar reproducción del video asociado | Lugar Rambla de Colonia con enlace de YouTube cargado | Activar **Videoclips** y observar el reproductor | Si el video externo está disponible, el reproductor debe poder reproducirlo | Se renderizó el `iframe`, pero YouTube informó “Este video no está disponible” | Fallida (dependencia externa) |

### Evidencia observada — caja negra

Resumen obtenido al accionar los cuatro filtros en el navegador:

```text
Todos los lugares: contador 11; 11 elementos visibles
Canciones:         contador 7;  7 elementos visibles
Videoclips:        contador 2;  Rambla de Colonia, Real de San Carlos
Artistas:          contador 2;  El General, Faro de Colonia
```

En cada filtro, el estado accesible del botón seleccionado fue
`aria-pressed="true"`. Los conteos de categorías sumaron 11, el total mostrado.

Evidencia del caso BB-06: al seleccionar Rambla de Colonia, el reproductor
apareció, pero dentro del `iframe` se observó el mensaje de YouTube
**“Este video no está disponible”**. Esto confirma que la interfaz presenta el
reproductor, pero no que el contenido externo siga publicado o permita
reproducción.

## 6. Análisis de caja blanca: `getYouTubeEmbedUrl`

La función está definida en `src/Components/PlaceDetails.jsx`. Toma una URL y
devuelve la URL normalizada del reproductor o `null`.

### Condiciones y decisiones identificadas

1. **Entrada vacía:** si `value` es falsy, retorna `null` antes de procesar la
   URL.
2. **Parseo:** `new URL(value)` puede completarse o lanzar una excepción, que se
   captura y convierte en `null`.
3. **Protocolo:** solo se aceptan `http:` y `https:`.
4. **Dominio:**
   - `youtu.be`: obtiene el identificador del primer segmento de la ruta.
   - `youtube.com`, `m.youtube.com` o `youtube-nocookie.com`: obtiene el
     parámetro `v` o un identificador de las rutas `embed`, `shorts` o `live`.
   - Otro dominio no produce identificador.
5. **Identificador:** debe cumplir `^[\w-]{11}$`; si no, retorna `null`.
6. **Salida:** cuando el identificador es válido, devuelve
   `https://www.youtube-nocookie.com/embed/{id}`.

### Caminos de ejecución cubiertos

- Retorno temprano por entrada vacía.
- URL corta `youtu.be` válida.
- URL estándar con parámetro `v`.
- URL de ruta `shorts`.
- URL de ruta `embed`.
- Identificador con longitud incorrecta.
- Dominio no admitido.
- Protocolo no admitido.
- Error de parseo de URL.

### Matriz de casos de caja blanca

| ID | Objetivo / camino | Datos de entrada | Procedimiento | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|
| BC-01 | Cubrir `youtu.be` válido | `https://youtu.be/8nx-G-VMt5A` | Invocar la función y comparar su retorno | `https://www.youtube-nocookie.com/embed/8nx-G-VMt5A` | URL esperada | Aprobada |
| BC-02 | Cubrir URL `watch` y parámetro `v` | `https://www.youtube.com/watch?v=8nx-G-VMt5A` | Invocar la función y comparar su retorno | URL normalizada de inserción | URL esperada | Aprobada |
| BC-03 | Cubrir ruta `shorts` | `https://youtube.com/shorts/8nx-G-VMt5A` | Invocar la función y comparar su retorno | URL normalizada de inserción | URL esperada | Aprobada |
| BC-04 | Cubrir ruta `embed` y dominio `youtube-nocookie.com` | `https://www.youtube-nocookie.com/embed/8nx-G-VMt5A` | Invocar la función y comparar su retorno | URL normalizada de inserción | URL esperada | Aprobada |
| BC-05 | Rechazar ID demasiado corto | `https://youtu.be/short` | Invocar la función y comparar su retorno | `null` | `null` | Aprobada |
| BC-06 | Rechazar dominio externo | `https://example.com/watch?v=8nx-G-VMt5A` | Invocar la función y comparar su retorno | `null` | `null` | Aprobada |
| BC-07 | Rechazar protocolo no HTTP(S) | `javascript:alert(1)` | Invocar la función y comparar su retorno | `null` | `null` | Aprobada |
| BC-08 | Cubrir retorno temprano | Cadena vacía | Invocar la función y comparar su retorno | `null` | `null` | Aprobada |
| BC-09 | Cubrir excepción del constructor URL | `not a URL` | Invocar la función y comparar su retorno | `null` | `null` | Aprobada |

### Evidencia de ejecución — caja blanca

Se ejecutaron los casos sobre el cuerpo de la función del archivo fuente con
Node.js. Fragmento representativo de las aserciones usadas:

```js
const actual = getYouTubeEmbedUrl(input);
const passed = actual === expected;
console.log(passed ? 'PASS' : 'FAIL', name, { expected, actual });
```

Resultado de consola: **9/9 casos aprobados**. Las pruebas ejercitaron el cuerpo
real de la función, aunque se lanzaron con un script temporal y no quedaron como
una suite persistente del repositorio.

## 7. Errores, riesgos y mejoras propuestas

1. **Contenido de YouTube no disponible — observado.** El reproductor de Rambla
   mostró el mensaje de indisponibilidad de YouTube. No se puede determinar solo
   desde la aplicación si el video fue eliminado, es privado o tiene una
   restricción externa. Verificar el enlace desde una sesión pública y
   reemplazarlo por un video vigente.
2. **La conversión de URL no verifica disponibilidad.** La función valida
   dominio, protocolo y formato del ID, pero no puede asegurar que el video
   exista o permita inserción. Añadir una comprobación editorial antes de
   publicar el enlace.
3. **Nombres repetidos en el catálogo — observación.** En esta ejecución varios
   lugares aparecieron con el nombre “Colonia del Sacramento”. Los conteos
   coinciden, pero un usuario podría no distinguir esos puntos en la lista.
   Proponer nombres descriptivos y únicos o añadir una referencia de barrio.
4. **Persistencia de pruebas.** Los casos de `getYouTubeEmbedUrl` se ejecutaron
   con un script temporal; `package.json` no define un framework ni un comando
   de pruebas automatizadas. Agregar una suite persistente permitiría repetir
   las verificaciones en futuras modificaciones.
5. **Reproductor externo.** Informar visualmente cuando un video no puede
   cargarse y ofrecer un enlace alternativo al recurso original, siempre que se
   conozca una URL válida.

## 8. Verificaciones generales complementarias

Además de los casos funcionales:

- `npm run lint`: finalizó con código de salida 0.
- `npm run build`: finalizó con código de salida 0. Vite mostró una advertencia
  de que el bundle JavaScript generado supera 500 kB minificado.

Estas verificaciones corroboran análisis estático y compilación, pero no
sustituyen pruebas de integración con Supabase ni garantizan la disponibilidad
de contenido externo.

## 9. Reflexión final

Las pruebas de caja negra comprobaron el comportamiento visible para quien usa
Colonia Sonora: los filtros muestran las categorías y cantidades esperadas, y
el panel intenta presentar el medio asociado al lugar. También permitieron
detectar que un video puede estar correctamente integrado en la interfaz y, aun
así, no estar disponible en el proveedor externo.

Las pruebas de caja blanca complementaron esa observación al recorrer las ramas
internas de la conversión de URLs, incluyendo entradas válidas, formatos
alternativos e inválidos. En conjunto, ambos enfoques contrastan resultados
observables con decisiones del código, ayudan a localizar defectos y aportan
criterios concretos para mantener la calidad del sistema.
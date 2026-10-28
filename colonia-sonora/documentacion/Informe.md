# Informe del proyecto: Colonia Sonora

**Fecha de actualización:** 28 de octubre de 2026  
**Tipo de producto:** aplicación web interactiva  
**Ubicación del proyecto:** `colonia-sonora/`

## 1. Resumen

Colonia Sonora es una aplicación web que permite explorar lugares de Colonia del
Sacramento vinculados con canciones, artistas y videoclips. La experiencia
principal combina un mapa interactivo con información contextual y enlaces o
videos musicales. También incluye un catálogo administrable para gestionar
lugares, canciones y recorridos.

El proyecto está implementado como una aplicación de una sola página (SPA). La
interfaz pública consulta el catálogo publicado en Supabase; Clerk gestiona la
identidad de las cuentas y el acceso al panel administrativo.

## 2. Objetivos y alcance

- Difundir la identidad musical y cultural de Colonia del Sacramento.
- Relacionar puntos geográficos con información musical y audiovisual.
- Permitir explorar los puntos por categoría y seleccionar ubicaciones en el
  mapa o en una lista.
- Ofrecer a administradores autorizados herramientas para mantener el catálogo.
- Presentar recorridos musicales ordenados por sus paradas.

La aplicación enlaza contenido externo —por ejemplo, YouTube— y no es un
servicio propio de streaming musical ni una aplicación de navegación GPS.

## 3. Funcionalidades

### 3.1. Experiencia pública

- Portada con identidad visual y acceso para comenzar la exploración.
- Accesos rápidos a lugares, música, artistas y recorridos.
- Mapa centrado en Colonia del Sacramento con marcadores diferenciados por
  categoría.
- Filtros para ver todos los lugares, canciones, videoclips o artistas.
- Selección sincronizada entre los marcadores del mapa y la lista de lugares.
- Panel de detalle con nombre, categoría, descripción, coordenadas y contenido
  relacionado.
- Reproducción incrustada de videos compatibles de YouTube mediante el dominio
  `youtube-nocookie.com`; cuando no hay un enlace cargado, se ofrece una búsqueda
  musical externa.
- Ventana de recorridos con su descripción y paradas en orden.
- Mensajes de estado y error para informar, por ejemplo, cuando el catálogo no
  está disponible o todavía no tiene contenido publicado.

El texto introductorio de la sección de exploración se actualizó a:

> **Descubrí Colonia a través de su música**
>
> Un recorrido interactivo por la identidad musical de Colonia del Sacramento.
> Explorá su mapa y descubrí canciones que reflejan la historia, la cultura y las
> vivencias de sus barrios, conectando cada rincón con los sonidos que forman
> parte de su identidad.
>
> Colonia tiene historias que contar y canciones que las hacen sonar.

También se añadieron estilos específicos para el encabezado y los párrafos de
esa introducción.

### 3.2. Administración

El panel administrativo dispone de secciones para:

- **Lugares:** crear, editar y eliminar ubicaciones, definir categoría y datos,
  asignar coordenadas con un selector de mapa e incluir un enlace multimedia.
- **Canciones:** administrar título, artista, descripción, URL, publicación y
  lugar relacionado.
- **Recorridos:** administrar nombre, descripción, publicación y paradas en un
  orden determinado.

Los formularios verifican datos como rangos de latitud y longitud, formato de
enlaces y selección de paradas. Las operaciones que fallan se muestran al
administrador en el panel.

## 4. Tecnologías y servicios utilizados

| Área | Tecnología o servicio | Uso |
|---|---|---|
| Interfaz | React 19 | Componentes y estado de la aplicación |
| Desarrollo y compilación | Vite 8 | Servidor local y generación de archivos de producción |
| Mapa | Leaflet y React Leaflet | Mapa, marcadores, popups y selección de coordenadas |
| Datos | Supabase | Base de datos PostgreSQL y acceso desde la aplicación |
| Identidad | Clerk | Inicio de sesión y estado de sesión de los administradores |
| Mapas base | OpenStreetMap | Teselas cartográficas y atribución del mapa |
| Calidad estática | ESLint | Análisis de código mediante el script `lint` |
| Publicación documentada | Vercel | Despliegue estático descrito en el README |

El reproductor y los enlaces musicales dependen de servicios de terceros y de la
disponibilidad de las URLs cargadas.

## 5. Arquitectura y archivos principales

- `src/main.jsx`: punto de entrada React; inicializa Clerk cuando está
  configurada su clave pública.
- `src/App.jsx`: coordina navegación, filtros, selección, catálogo y apertura de
  las vistas administrativas y de recorridos.
- `src/Components/Header.jsx`: marca, acceso de sesión y acceso administrativo.
- `src/Components/Hero.jsx`: portada y acción para abrir la exploración.
- `src/Components/MapPanel.jsx`: presenta el mapa y la leyenda de categorías.
- `src/Components/Mapacolonia.jsx`: mapa público y selector de coordenadas para
  el formulario de lugares.
- `src/Components/PlaceDetails.jsx`: datos y contenido musical del lugar
  seleccionado.
- `src/Components/RoutesModal.jsx`: presentación pública de los recorridos.
- `src/Components/AdminPanel.jsx`: formularios y operaciones de administración.
- `src/hooks/useCatalog.js`: carga y transformación de lugares, canciones,
  recorridos y paradas.
- `src/hooks/useUserRole.js`: consulta y mantiene el rol de la sesión actual.
- `src/lib/supabase.js`: crea el cliente de Supabase a partir de la configuración
  pública y del token de acceso.
- `src/App.css` y `src/index.css`: estilos y presentación adaptable.
- `supabase/schema.sql`: esquema, funciones, políticas de acceso y datos
  iniciales.
- `supabase/clerk-migration.sql`: migración documentada para bases que usaban
  perfiles vinculados a Supabase Auth.
- `supabase/add-location-media-url.sql`: agrega el campo de enlace multimedia a
  instalaciones existentes.

La separación de encabezado, portada, mapa, detalle, recorridos y lógica de
catálogo/rol mantiene esas responsabilidades en módulos distintos.

## 6. Datos y permisos

El esquema de Supabase define las siguientes tablas:

- `profiles`: identidad, correo y rol (`user` o `admin`).
- `locations`: nombre, categoría, tipo, coordenadas, detalles, enlace multimedia
  y estado de publicación.
- `songs`: título, artista, URL, descripción, lugar relacionado y publicación.
- `routes`: nombre, descripción y publicación.
- `route_stops`: relación entre recorrido y lugar, con posición ordenada.

El esquema activa Row Level Security (RLS). Los lectores anónimos y autenticados
pueden consultar contenido publicado; las operaciones de gestión se limitan a
administradores según el rol guardado en `profiles`. El perfil de una cuenta
autenticada solo puede consultarse con su propio identificador. La función
`replace_route_stops` exige permisos de administrador al reemplazar las paradas
de un recorrido.

La aplicación carga lugares, canciones, recorridos y paradas activos desde
Supabase. Si no puede obtener el catálogo, comunica el error y mantiene los
lugares iniciales definidos en la aplicación para que la exploración siga
disponible.

## 7. Configuración y ejecución

### Variables de entorno

El archivo `.env.example` indica las variables requeridas. Se configuran en
`.env.local` para desarrollo y en el proveedor de despliegue para producción:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_reemplazar_con_la_clave_publicable
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publicable
```

Los valores anteriores son marcadores de ejemplo, no credenciales funcionales.
No se deben incluir claves secretas de Clerk o Supabase en variables `VITE_` ni
en el repositorio. La clave publicable de Clerk es necesaria para montar la
aplicación con acceso de administradores; si falta, la entrada muestra un aviso
de configuración.

### Comandos

Ejecutar desde `colonia-sonora/`:

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

`npm run build` genera los archivos estáticos en `dist/`; `npm run preview`
permite servir localmente esa compilación.

### Preparación de Supabase y Clerk

Para una base nueva se ejecuta `supabase/schema.sql`. Para una base existente,
el README explica cuándo aplicar `supabase/clerk-migration.sql` y
`supabase/add-location-media-url.sql`. La cuenta administradora se crea o invita
desde Clerk y su identificador se registra con rol `admin` en
`public.profiles`. El README del proyecto contiene los pasos detallados para la
integración, el despliegue en Vercel y la configuración de dominio.

## 8. Cambios registrados en el estado actual del proyecto

En el árbol de trabajo inspeccionado para este informe están presentes estos
cambios de implementación:

1. Se actualizó el texto de introducción de la exploración y se añadieron los
   estilos de título y párrafos correspondientes.
2. Se organiza la interfaz en componentes separados para encabezado, portada,
   mapa, detalle de lugar y recorridos.
3. La carga del catálogo y la comprobación del rol se encapsulan en los hooks
   `useCatalog` y `useUserRole`.
4. El esquema incluye la relación de canciones con lugares, recorridos con
   paradas, publicación, políticas RLS y operaciones restringidas por rol.
5. Se contempla el enlace multimedia de los lugares mediante `media_url` y un
   script SQL de actualización para bases existentes.
6. El README describe configuración de servicios, gestión de contenido y
   publicación.

La lista describe el estado de los archivos inspeccionados; no representa un
historial completo de commits ni atribuye cada cambio a una versión concreta.

## 9. Verificación y observaciones

Los scripts de verificación disponibles en `package.json` son `npm run lint` y
`npm run build`. Este informe es documentación descriptiva; no agrega pruebas
automatizadas ni afirma una nueva ejecución de esos comandos.

Durante la inspección del repositorio, Git informó conflictos sin resolver en
archivos generados de `dist/` (el HTML y hojas de estilo compiladas). Conviene
resolver ese estado de integración o regenerar `dist/` antes de publicar una
versión final. Los archivos generados no son la fuente de la aplicación; el
código fuente reside en `src/`.

## 10. Posibles mejoras futuras

- Agregar pruebas automatizadas para filtros, permisos, formularios y
  presentación del catálogo.
- Revisar accesibilidad con teclado y tecnologías de asistencia en los diálogos
  y el mapa.
- Ampliar el catálogo y completar la curaduría de canciones y artistas.
- Definir un flujo de despliegue que compile desde el código fuente y no dependa
  de artefactos `dist/` versionados.
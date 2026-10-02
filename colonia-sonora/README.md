# Colonia Sonora

Mapa interactivo de música y lugares de Colonia del Sacramento. Está construido con React y Vite y se publica como un sitio estático.

## Probar y compilar

Desde esta carpeta, ejecutá:

```sh
npm ci
npm run dev
```

Para generar los archivos de producción:

```sh
npm run build
```

Vite crea el sitio listo para publicar en `dist/`.

## Publicar en Netlify

### Conectar GitHub

1. Subí el repositorio a GitHub.
2. En Netlify, elegí **Add new site** y luego **Import an existing project**. Conectá GitHub y seleccioná el repositorio.
3. Si la raíz del repositorio es la carpeta contenedora `EcoColonia`, configurá **Base directory** como `colonia-sonora`. Si el repositorio ya empieza dentro de `colonia-sonora`, dejá la base vacía.
4. Usá `npm run build` como **Build command** y `dist` como **Publish directory**.
5. Elegí **Deploy site**. Netlify publicará el sitio y te dará una URL `netlify.app`. Los siguientes cambios enviados a la rama conectada se publicarán automáticamente.

### Publicar una compilación manual

Ejecutá `npm run build` en esta carpeta y cargá la carpeta `dist/` desde la opción de despliegue manual de Netlify. Esta opción no conecta GitHub ni publica automáticamente los cambios futuros.

## Conectar un dominio `.app`

1. Registrá el dominio que quieras en un registrador que venda dominios `.app`.
2. En Netlify, abrí el sitio y entrá en **Domain management** (o **Domain settings**) > **Add a domain**. Escribí el dominio y seguí la verificación.
3. Netlify mostrará qué registros DNS necesita. Copialos exactamente en la configuración DNS del registrador; los valores dependen del dominio y del método de conexión.
4. Esperá a que Netlify confirme el DNS y emita el certificado TLS. Activá **HTTPS** como dominio principal cuando esté disponible.

Los dominios `.app` requieren HTTPS. No cambies los servidores DNS ni elimines registros existentes sin revisar primero las instrucciones que muestre Netlify.

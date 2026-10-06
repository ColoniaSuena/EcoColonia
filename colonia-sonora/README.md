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

## Publicar en Vercel

### Importar desde GitHub

1. Subí el repositorio a GitHub.
2. En Vercel, elegí **Add New...** > **Project**, conectá GitHub e importá el repositorio.
3. Configurá **Root Directory** según cómo subiste el proyecto:
	- Si la raíz del repositorio contiene la carpeta `EcoColonia`, seleccioná `colonia-sonora`.
	- Si la raíz del repositorio ya es la carpeta `colonia-sonora`, dejá `./` como directorio raíz.
4. Seleccioná **Vite** como framework si Vercel no lo detecta automáticamente. Usá `npm run build` como **Build Command** y `dist` como **Output Directory**.
5. Elegí **Deploy**. Vercel compilará el sitio y te dará una URL `vercel.app`. Los siguientes cambios enviados a la rama conectada se publicarán automáticamente.

## Conectar un dominio `.app` en Vercel

1. Registrá el dominio que quieras en un registrador que venda dominios `.app`.
2. En el proyecto de Vercel, abrí **Settings** > **Domains**, agregá el dominio y seguí las instrucciones de verificación.
3. Vercel mostrará los registros DNS necesarios. Copialos exactamente en la configuración DNS del registrador; los valores dependen del dominio y de la configuración de Vercel.
4. Esperá a que Vercel confirme el DNS y active HTTPS para el dominio.

Los dominios `.app` requieren HTTPS. No cambies los servidores DNS ni elimines registros existentes sin revisar primero las instrucciones que muestre Vercel.

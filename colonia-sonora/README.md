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

## Usuarios, Supabase y administración

La aplicación usa Supabase Auth para el registro público por correo y contraseña y Supabase Database para lugares, canciones y recorridos. Las políticas de Row Level Security permiten leer contenido publicado sin iniciar sesión; solamente las cuentas con rol `admin` pueden crear, editar o eliminar contenido. Las cuentas nuevas reciben siempre el rol `user`.

### Crear y configurar el proyecto

1. Creá un proyecto en [Supabase](https://supabase.com/dashboard) y confirmá que el correo electrónico esté habilitado como método de autenticación.
2. En el SQL Editor del proyecto, ejecutá el contenido completo de [`supabase/schema.sql`](./supabase/schema.sql). Crea las tablas, las políticas de acceso, el registro de perfiles y los lugares iniciales del mapa.
3. Copiá `.env.example` como `.env.local` y completá las credenciales del proyecto, disponibles en **Project Settings** > **API**:

   ```dotenv
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-publicable
   ```

   La clave pública/publishable está diseñada para el navegador y queda protegida por las políticas RLS. **No uses ni publiques la clave `service_role` o una clave secreta.**
4. Configurá **Authentication** > **URL Configuration** con la URL local `http://localhost:5173` para desarrollo y la URL de producción de Vercel para el sitio publicado. Agregá ambas a **Redirect URLs** para que funcionen la confirmación por correo y la recuperación de contraseña.
5. Reiniciá `npm run dev` después de cambiar las variables de entorno.
6. En Vercel, abrí **Project Settings** > **Environment Variables** y agregá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para **Production**, **Preview** y **Development** según corresponda. Después de guardarlas, volvé a desplegar el proyecto.

### Promover la primera cuenta administradora

Registrá la cuenta desde el sitio y confirmá el correo. Luego, desde el SQL Editor de Supabase, ejecutá el siguiente comando con el correo exacto de esa cuenta:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@ejemplo.com';
```

La aplicación consulta ese rol en el servidor protegido por RLS y muestra **Administrar** solamente a administradores. El panel permite administrar lugares y sus coordenadas, canciones y enlaces, y recorridos con sus paradas. No existe un registro público de cuentas administrador; los roles se asignan desde el SQL Editor.

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

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

## Acceso de administradores

Clerk gestiona el inicio de sesión y Supabase conserva la base de datos. No hay registro público en la página: las cuentas se crean o invitan desde Clerk, y Supabase RLS autoriza cambios de contenido solo a los perfiles marcados `admin`.

1. En el [panel de Clerk](https://dashboard.clerk.com/), abre la aplicación, desactiva el registro público en las opciones de registro y copia la **Publishable key** (`pk_...`).
2. En Clerk, abre **Supabase integration setup**, activa la integración y copia el dominio de Clerk.
3. En Supabase, abre **Authentication > Third-Party Auth**, agrega Clerk y pega el dominio que copiaste. Sigue el asistente de Clerk para que las sesiones incluyan el rol `authenticated`.
4. Si la base ya existe con perfiles UUID de Supabase Auth, ejecuta una sola vez [`supabase/clerk-migration.sql`](./supabase/clerk-migration.sql) en el SQL Editor. Conserva las tablas de contenido, pero quita el rol admin de las cuentas antiguas; no lo ejecutes de nuevo. Para una base nueva, ejecuta [`supabase/schema.sql`](./supabase/schema.sql).
5. En Clerk, crea o invita la cuenta del administrador. Copia su **User ID** (`user_...`) y en el SQL Editor de Supabase asígnale el rol:

   ```sql
   insert into public.profiles (id, email, role)
   values ('user_ID_DE_CLERK', 'admin@ejemplo.com', 'admin')
   on conflict (id) do update
   set email = excluded.email, role = 'admin';
   ```

6. En `.env.local` y **Vercel > Project Settings > Environment Variables**, configura `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL` (URL base, sin `/rest/v1`) y `VITE_SUPABASE_ANON_KEY`. Elimina variables de Clerk que ya no uses y vuelve a desplegar.

### Agregar lugares y canciones

1. Iniciá sesión con una cuenta administradora y abrí **Administrar**.
2. En **Lugares**, creá el punto, completá nombre y categoría, y hacé clic en su ubicación en el mapa. Las coordenadas se actualizan con ese punto; también podés ajustarlas en los campos de latitud y longitud. Guardá el lugar.
3. En **Canciones**, completá el título, pegá el enlace directo de la canción (por ejemplo, de YouTube o Spotify) y elegí el lugar relacionado. Guardá el registro y dejalo publicado.
4. Al seleccionar ese lugar en el mapa público, aparecerán los datos de la canción. **Escuchar canción** abre el enlace guardado en una pestaña nueva; la reproducción la controla el servicio enlazado.

Las claves publicables (`pk_...` y Supabase publishable/anon) se usan en el navegador. Nunca pongas claves secretas (`sk_...` o `service_role`) en variables `VITE_`.

Para producción, Clerk requiere una instancia de producción y un dominio propio con acceso a DNS. Con `eco-colonia.vercel.app` puedes probar la integración, pero no completar la configuración recomendada de producción de Clerk.

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

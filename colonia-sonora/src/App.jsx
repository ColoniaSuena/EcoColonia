import { useCallback, useEffect, useMemo, useState } from 'react';
import { Show, SignInButton, UserButton, useSession, useUser } from '@clerk/react';
import AdminPanel from './Components/AdminPanel.jsx';
import Mapacolonia from './Components/Mapacolonia.jsx';
import { createSupabaseClient } from './lib/supabase.js';
import './App.css';

const lugaresIniciales = [
  {
    id: 'barrio-historico',
    nombre: 'Barrio Histórico',
    categoria: 'cancion',
    tipo: 'Canción sobre el lugar',
    coordenadas: [-34.4719, -57.8579],
    detalle: 'Letras y canciones que nombran las calles, la historia o la vida del barrio.',
  },
  {
    id: 'faro',
    nombre: 'Faro de Colonia',
    categoria: 'artista',
    tipo: 'Artista de la zona',
    coordenadas: [-34.4717, -57.8515],
    detalle: 'Una búsqueda abierta de artistas nacidos en Colonia y sus alrededores.',
  },
  {
    id: 'plaza-de-toros',
    nombre: 'Real de San Carlos',
    categoria: 'videoclip',
    tipo: 'Videoclip filmado aquí',
    coordenadas: [-34.4385, -57.8425],
    detalle: 'Videoclips y sesiones musicales registrados en este rincón de la ciudad.',
  },
  {
    id: 'rambla',
    nombre: 'Rambla de Colonia',
    categoria: 'cancion',
    tipo: 'Canción sobre el lugar',
    coordenadas: [-34.474, -57.846],
    detalle: 'https://www.youtube.com/watch?v=8nx-G-VMt5A',
  },
  {
    id: 'luana',
    nombre: 'Luana',
    categoria: 'artista',
    tipo: 'Artista de Colonia',
    coordenadas: [-34.450060, -57.816829],
    detalle: 'Luana Persincula, conocida artísticamente como Luana.',
  },
];

const filtros = [
  { id: 'todos', nombre: 'Todos los lugares' },
  { id: 'cancion', nombre: 'Canciones' },
  { id: 'videoclip', nombre: 'Videoclips' },
  { id: 'artista', nombre: 'Artistas' },
];

function App() {
  const { isLoaded: sessionLoaded, session } = useSession();
  const { isLoaded: userLoaded, user } = useUser();
  const supabase = useMemo(
    () => createSupabaseClient(async () => (session ? session.getToken() : null)),
    [session],
  );
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [lugarActivoId, setLugarActivoId] = useState(lugaresIniciales[0].id);
  const [lugares, setLugares] = useState(lugaresIniciales);
  const [canciones, setCanciones] = useState([]);
  const [recorridos, setRecorridos] = useState([]);
  const [errorCatalogo, setErrorCatalogo] = useState('');
  const [perfil, setPerfil] = useState({ userId: null, sessionId: null, role: '', error: '' });
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [mostrarRecorridos, setMostrarRecorridos] = useState(false);
  const rol = user && session && perfil.userId === user.id && perfil.sessionId === session.id
    ? perfil.role
    : '';
  const errorCuenta = user && session && perfil.userId === user.id && perfil.sessionId === session.id
    ? perfil.error
    : '';
  const lugaresVisibles = filtroActivo === 'todos'
    ? lugares
    : lugares.filter((lugar) => lugar.categoria === filtroActivo);
  const lugarActivo = lugaresVisibles.find((lugar) => lugar.id === lugarActivoId) ?? lugaresVisibles[0] ?? null;
  const indiceLugarActivo = lugarActivo ? lugaresVisibles.findIndex((lugar) => lugar.id === lugarActivo.id) + 1 : 0;

  useEffect(() => {
    if (!sessionLoaded || !userLoaded || !supabase) return undefined;
    let activo = true;

    if (!user) {
      return () => {
        activo = false;
      };
    }

    async function cargarRol() {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (!activo) return;
      if (error) {
        setPerfil({
          userId: user.id,
          sessionId: session.id,
          role: '',
          error: `No se pudo verificar el rol de la cuenta: ${error.message}`,
        });
        return;
      }
      setPerfil({
        userId: user.id,
        sessionId: session.id,
        role: data?.role ?? 'user',
        error: '',
      });
    }

    void cargarRol();

    return () => {
      activo = false;
    };
  }, [sessionLoaded, userLoaded, user, session, supabase]);

  const cargarCatalogo = useCallback(async (lugarSeleccionadoId = null) => {
    setErrorCatalogo('');
    if (!supabase) {
      setErrorCatalogo('No se pudo conectar con Supabase. Revisá las variables de entorno.');
      return;
    }
    try {
      const [
        { data: locations, error: locationsError },
        { data: songs, error: songsError },
        { data: routes, error: routesError },
        { data: stops, error: stopsError },
      ] = await Promise.all([
        supabase.from('locations').select('*').eq('is_active', true).order('name'),
        supabase.from('songs').select('*').eq('is_active', true).order('title'),
        supabase.from('routes').select('*').eq('is_active', true).order('name'),
        supabase.from('route_stops').select('route_id, location_id, position').order('position'),
      ]);
      if (locationsError) throw locationsError;
      if (songsError) throw songsError;
      if (routesError) throw routesError;
      if (stopsError) throw stopsError;

      const lugaresCargados = locations.map((location) => ({
        id: location.id,
        nombre: location.name,
        categoria: location.category,
        tipo: location.type,
        coordenadas: [location.latitude, location.longitude],
        detalle: location.details,
      }));
      setLugares(lugaresCargados);
      if (lugarSeleccionadoId && lugaresCargados.some((lugar) => lugar.id === lugarSeleccionadoId)) {
        setFiltroActivo('todos');
        setLugarActivoId(lugarSeleccionadoId);
      }
      setCanciones(songs);
      setRecorridos(routes.map((route) => ({
        ...route,
        location_ids: stops
          .filter((stop) => stop.route_id === route.id)
          .sort((a, b) => a.position - b.position)
          .map((stop) => stop.location_id),
      })));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorCatalogo(`No se pudo cargar el catálogo desde Supabase: ${message}`);
    }
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) void cargarCatalogo();
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [cargarCatalogo]);

  function cambiarFiltro(filtroId) {
    setFiltroActivo(filtroId);
    const primerLugar = filtroId === 'todos'
      ? lugares[0]
      : lugares.find((lugar) => lugar.categoria === filtroId);
    if (primerLugar) setLugarActivoId(primerLugar.id);
  }

  function explorar(filtroId = 'todos') {
    cambiarFiltro(filtroId);
    document.getElementById('exploracion')?.scrollIntoView({ behavior: 'smooth' });
  }

  const esArtista = lugarActivo?.categoria === 'artista';
  const busquedaMusical = encodeURIComponent(
    esArtista
      ? `${lugarActivo?.nombre ?? ''} ${lugarActivo?.tipo ?? ''} música`
      : `${lugarActivo?.nombre ?? ''} Colonia del Sacramento música canción`,
  );
  const cancionesLugar = canciones.filter((cancion) => cancion.location_id === lugarActivo?.id);
  const cancionActiva = cancionesLugar[0];

  return (
    <main className="sonora-app">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Colonia Sonora, inicio">
          <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M7 42h34M10 40V20l14-12 14 12v20M16 40V25h16v15M21 40V29h6v11M7 20h34M19 16h10M23 8V4h2v4" />
            <path d="M5 42V18l19-15 19 15v24" />
          </svg>
          <span className="brand-lockup">
            <span className="brand-name">ECOS<br />COLONIA</span>
            <span className="brand-tagline">A TRAVÉS DE LA MÚSICA</span>
          </span>
        </a>
        <div className="account-actions">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="login-link" type="button">
                <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6" r="3" /><path d="M4.5 16c.5-3 2.4-4.5 5.5-4.5s5 1.5 5.5 4.5" /></svg>
                Ingresar
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            {rol === 'admin' && <button className="login-link admin-open" type="button" onClick={() => setMostrarAdmin(true)}>Administrar</button>}
            <span className="account-email">{user?.primaryEmailAddress?.emailAddress}</span>
            <UserButton />
          </Show>
        </div>
      </header>
      {errorCuenta && <p className="backend-alert" role="alert">{errorCuenta}</p>}
      {user && rol === 'user' && (
        <p className="backend-alert" role="status">
          Esta cuenta no tiene permisos de administración. Solicitá acceso al administrador del sitio.
        </p>
      )}

      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="hero-content">
          <h1 id="hero-title">DESCUBRÍ COLONIA</h1>
          <p>A TRAVÉS DE LA MÚSICA</p>
          <button className="hero-cta" type="button" onClick={() => explorar()}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 18s6-5.7 6-10a6 6 0 1 0-12 0c0 4.3 6 10 6 10Z" /><circle cx="10" cy="8" r="2" /></svg>
            EXPLORAR MAPA
          </button>
        </div>
      </section>

      <section className="quick-explore" aria-labelledby="quick-explore-title">
        <h2 id="quick-explore-title">¿Qué querés descubrir?</h2>
        <div className="quick-links">
          <button className="quick-link quick-link-places" type="button" onClick={() => explorar('todos')}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13Z" /><circle cx="12" cy="9" r="2.5" /></svg>
            Lugares
          </button>
          <button className="quick-link quick-link-music" type="button" onClick={() => explorar('cancion')}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 18V5l11-2v13M10 8l11-2" /><ellipse cx="6.5" cy="18.5" rx="3.5" ry="2.5" /><ellipse cx="17.5" cy="16.5" rx="3.5" ry="2.5" /></svg>
            Música
          </button>
          <button className="quick-link quick-link-artists" type="button" onClick={() => explorar('artista')}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>
            Artistas
          </button>
          <button className="quick-link quick-link-routes" type="button" onClick={() => setMostrarRecorridos(true)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c4-8 10-8 14-14M5 19h5m9-14h-5" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="5" r="2" /><path d="M12 7v5m-2-3h4" /></svg>
            Recorridos
          </button>
        </div>
      </section>

      <section className="explorer" id="exploracion" aria-labelledby="page-title">
        {errorCatalogo && <p className="backend-alert" role="alert">{errorCatalogo} Se conserva el catálogo inicial para que el mapa siga disponible.</p>}
        <div className="explorer-heading">
          <div>
            <p className="eyebrow">GEOGRAFÍA EN FRECUENCIA</p>
            <h1 id="page-title">La ciudad tiene <em>su canción.</em></h1>
            <p className="intro-copy">Elegí un punto del mapa y encontrá la música que vive ahí.</p>
          </div>
          <div className="map-index" aria-label={`${lugaresVisibles.length} lugares en el mapa`}>
            <span className="map-index-number">0{lugaresVisibles.length}</span>
            <span className="map-index-label">LUGARES<br />PARA EXPLORAR</span>
          </div>
        </div>

        <div className="filter-bar" aria-label="Filtrar lugares por tipo de vínculo">
          <span className="filter-caption">EXPLORAR POR</span>
          <div className="filter-options">
            {filtros.map((filtro) => (
              <button
                className={`filter-button${filtroActivo === filtro.id ? ' is-active' : ''}`}
                key={filtro.id}
                type="button"
                aria-pressed={filtroActivo === filtro.id}
                onClick={() => cambiarFiltro(filtro.id)}
              >
                {filtro.nombre}
              </button>
            ))}
          </div>
          <span className="map-hint"><span className="hint-cross">+</span> TOCÁ UN PUNTO</span>
        </div>

        {lugarActivo ? <div className="discovery-layout">
          <div className="map-frame" aria-label="Mapa interactivo de Colonia del Sacramento">
            <Mapacolonia
              lugares={lugaresVisibles}
              lugarActivoId={lugarActivo.id}
              onSelect={setLugarActivoId}
            />
            <div className="map-legend" aria-label="Referencias del mapa">
              <span><i className="map-legend-dot is-song" /> Canciones</span>
              <span><i className="map-legend-dot is-video" /> Videoclips</span>
              <span><i className="map-legend-dot is-artist" /> Artistas</span>
            </div>
            <div className="map-stamp" aria-hidden="true"><span>34°28′S</span><span>57°50′W</span></div>
          </div>

          <aside
            className="place-panel"
            aria-live="polite"
            aria-label={esArtista ? `Artista ${lugarActivo.nombre}` : `Música de ${lugarActivo.nombre}`}
          >
            <div className="panel-topline">
              <span className="panel-marker"><span /></span>
              <span className="panel-kicker">{esArtista ? 'ARTISTA SELECCIONADO' : 'LUGAR SELECCIONADO'}</span>
              <span className="panel-number">0{indiceLugarActivo} / 0{lugaresVisibles.length}</span>
            </div>
            <div className="place-title-wrap">
              <p className="place-type">{lugarActivo.tipo}</p>
              <h2 className="place-title">{lugarActivo.nombre}</h2>
            </div>
            <div className="record-sleeve" aria-hidden="true">
              <div className="record-sun" />
              <div className="record-disc"><span className="record-center" /></div>
              <span className="sleeve-caption">COLONIA<br />SONORA</span>
              <span className="sleeve-side">ARCHIVO DE LUGAR · N.º 00{lugares.indexOf(lugarActivo) + 1}</span>
            </div>
            <div className="track-details">
              <div className="track-name-row">
                <div>
                  <p className="track-label">{esArtista ? 'ARTISTA' : 'PRÓXIMA PISTA'}</p>
                  <h3>{esArtista ? lugarActivo.nombre : cancionActiva?.title ?? 'Una canción por descubrir'}</h3>
                </div>
                {esArtista
                  ? <span className="track-pending">{lugarActivo.tipo}</span>
                  : cancionActiva?.artist
                  ? <span className="track-pending">{cancionActiva.artist}</span>
                  : !cancionActiva && <span className="track-pending" title="La curaduría todavía está abierta">EN CURADURÍA</span>}
              </div>
              <p className="track-description">
                {esArtista ? lugarActivo.detalle || lugarActivo.tipo : cancionActiva?.description || lugarActivo.detalle}
              </p>
              {!esArtista && !cancionActiva && <p className="curation-note">El vínculo entre la música y este lugar está pendiente de verificación.</p>}
              <a
                className="listen-link"
                href={cancionActiva?.url || `https://www.youtube.com/results?search_query=${busquedaMusical}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="listen-icon" aria-hidden="true">↗</span>
                {cancionActiva?.url
                  ? 'Escuchar canción'
                  : esArtista ? 'Explorar música del artista' : 'Explorar canciones'}
              </a>
            </div>
            <div className="panel-coordinates">
              <span>COLONIA DEL SACRAMENTO</span>
              <span>{Math.abs(lugarActivo.coordenadas[0]).toFixed(4)}° S</span>
            </div>
          </aside>
        </div> : <p className="catalog-empty" role="status">Todavía no hay lugares publicados. Volvé pronto para descubrir el catálogo.</p>}

        {lugarActivo && <nav className="place-list" aria-label="Lugares destacados">
          <span className="place-list-label">LUGARES DESTACADOS</span>
          {lugaresVisibles.map((lugar, index) => (
            <button
              key={lugar.id}
              type="button"
              className={`place-list-item${lugarActivo.id === lugar.id ? ' is-selected' : ''}`}
              aria-pressed={lugarActivo.id === lugar.id}
              onClick={() => setLugarActivoId(lugar.id)}
            >
              <span className="place-list-index">0{index + 1}</span>
              <span>{lugar.nombre}</span>
              <span className="place-list-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </nav>}
      </section>

      <footer className="site-footer">
        <span>COLONIA SONORA <span className="footer-separator">/</span> ARCHIVO MUSICAL EN CONSTRUCCIÓN</span>
        <a href="#inicio">VOLVER AL MAPA ↑</a>
      </footer>
      {mostrarAdmin && rol === 'admin' && (
        <AdminPanel
          supabase={supabase}
          locations={lugares.map((lugar) => ({ id: lugar.id, name: lugar.nombre }))}
          onClose={() => setMostrarAdmin(false)}
          onCatalogChanged={cargarCatalogo}
        />
      )}
      {mostrarRecorridos && (
        <div className="account-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setMostrarRecorridos(false);
        }}>
          <section className="account-dialog routes-dialog" role="dialog" aria-modal="true" aria-labelledby="routes-title">
            <button className="account-close" type="button" aria-label="Cerrar" onClick={() => setMostrarRecorridos(false)}>×</button>
            <p className="eyebrow">ECOS COLONIA</p>
            <h2 id="routes-title">Recorridos musicales</h2>
            {recorridos.length === 0
              ? <p className="account-intro">Todavía no hay recorridos publicados.</p>
              : recorridos.map((route) => (
                <article className="public-route" key={route.id}>
                  <h3>{route.name}</h3>
                  <p>{route.description}</p>
                  <ol>{route.location_ids.map((locationId) => {
                    const location = lugares.find((place) => place.id === locationId);
                    return location ? <li key={locationId}>{location.nombre}</li> : null;
                  })}</ol>
                </article>
              ))}
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
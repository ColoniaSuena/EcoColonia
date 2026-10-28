import { useMemo, useState } from 'react';
import { useSession, useUser } from '@clerk/react';
import AdminPanel from './Components/AdminPanel.jsx';
import Header from './Components/Header.jsx';
import Hero from './Components/Hero.jsx';
import MapPanel from './Components/MapPanel.jsx';
import PlaceDetails from './Components/PlaceDetails.jsx';
import RoutesModal from './Components/RoutesModal.jsx';
import { createSupabaseClient } from './lib/supabase.js';
import useCatalog from './hooks/useCatalog.js';
import useUserRole from './hooks/useUserRole.js';
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
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [mostrarRecorridos, setMostrarRecorridos] = useState(false);
  const { rol, errorCuenta } = useUserRole({ sessionLoaded, userLoaded, user, session, supabase });
  const { lugares, canciones, recorridos, errorCatalogo, cargarCatalogo } = useCatalog({
    supabase,
    initialPlaces: lugaresIniciales,
  });
  const lugaresVisibles = filtroActivo === 'todos'
    ? lugares
    : lugares.filter((lugar) => lugar.categoria === filtroActivo);
  const lugarActivo = lugaresVisibles.find((lugar) => lugar.id === lugarActivoId) ?? lugaresVisibles[0] ?? null;
  const indiceLugarActivo = lugarActivo ? lugaresVisibles.findIndex((lugar) => lugar.id === lugarActivo.id) + 1 : 0;

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
      <Header user={user} rol={rol} onOpenAdmin={() => setMostrarAdmin(true)} />
      {errorCuenta && <p className="backend-alert" role="alert">{errorCuenta}</p>}
      {user && rol === 'user' && (
        <p className="backend-alert" role="status">
          Esta cuenta no tiene permisos de administración. Solicitá acceso al administrador del sitio.
        </p>
      )}

      <Hero onExplore={explorar} />

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
            <div className="intro-copy">
              <h2>Descubrí Colonia a través de su música</h2>
              <p>
                Un recorrido interactivo por la identidad musical de Colonia del Sacramento.
                Explorá su mapa y descubrí canciones que reflejan la historia, la cultura y
                las vivencias de sus barrios, conectando cada rincón con los sonidos que
                forman parte de su identidad.
              </p>
              <p>Colonia tiene historias que contar y canciones que las hacen sonar.</p>
            </div>
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
          <MapPanel
            lugaresVisibles={lugaresVisibles}
            lugarActivoId={lugarActivo.id}
            onSelect={setLugarActivoId}
          />

          <PlaceDetails
            lugarActivo={lugarActivo}
            indiceLugarActivo={indiceLugarActivo}
            lugaresVisibles={lugaresVisibles}
            lugares={lugares}
            esArtista={esArtista}
            cancionActiva={cancionActiva}
            busquedaMusical={busquedaMusical}
          />
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
        <RoutesModal
          recorridos={recorridos}
          lugares={lugares}
          onClose={() => setMostrarRecorridos(false)}
        />
      )}
    </main>
  );
}

export default App;
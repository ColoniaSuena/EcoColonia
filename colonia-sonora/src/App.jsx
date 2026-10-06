import { useState } from 'react';
import Mapacolonia from './Components/Mapacolonia.jsx';
import './App.css';

const lugares = [
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
  { id: 'El General',
    nombre: 'El General',
    categoria: 'artista',
    tipo: 'Luana Persincula (Luana)',
    coordenadas: [-34.450060, -57.816829],
    detalle: 'Un artista local que ha dejado su huella en la música de Colonia.',
  },
];

const filtros = [
  { id: 'todos', nombre: 'Todos los lugares' },
  { id: 'cancion', nombre: 'Canciones' },
  { id: 'videoclip', nombre: 'Videoclips' },
  { id: 'artista', nombre: 'Artistas' },
];

function App() {
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [lugarActivoId, setLugarActivoId] = useState(lugares[0].id);
  const lugaresVisibles = filtroActivo === 'todos'
    ? lugares
    : lugares.filter((lugar) => lugar.categoria === filtroActivo);
  const lugarActivo = lugaresVisibles.find((lugar) => lugar.id === lugarActivoId) ?? lugaresVisibles[0];
  const indiceLugarActivo = lugaresVisibles.findIndex((lugar) => lugar.id === lugarActivo.id) + 1;

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

  const busquedaMusical = encodeURIComponent(`${lugarActivo.nombre} Colonia del Sacramento música canción`);

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
        <a className="login-link" href="#exploracion">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6" r="3" /><path d="M4.5 16c.5-3 2.4-4.5 5.5-4.5s5 1.5 5.5 4.5" /></svg>
          Ingresar
        </a>
      </header>

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
          <button className="quick-link quick-link-routes" type="button" onClick={() => explorar('todos')}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c4-8 10-8 14-14M5 19h5m9-14h-5" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="5" r="2" /><path d="M12 7v5m-2-3h4" /></svg>
            Recorridos
          </button>
        </div>
      </section>

      <section className="explorer" id="exploracion" aria-labelledby="page-title">
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

        <div className="discovery-layout">
          <div className="map-frame" aria-label="Mapa interactivo de Colonia del Sacramento">
            <Mapacolonia
              lugares={lugaresVisibles}
              lugarActivoId={lugarActivo.id}
              onSelect={setLugarActivoId}
            />
            <div className="map-stamp" aria-hidden="true"><span>34°28′S</span><span>57°50′W</span></div>
          </div>

          <aside className="place-panel" aria-live="polite" aria-label={`Música de ${lugarActivo.nombre}`}>
            <div className="panel-topline">
              <span className="panel-marker"><span /></span>
              <span className="panel-kicker">LUGAR SELECCIONADO</span>
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
                  <p className="track-label">PRÓXIMA PISTA</p>
                  <h3>Una canción por descubrir</h3>
                </div>
                <span className="track-pending" title="La curaduría todavía está abierta">EN CURADURÍA</span>
              </div>
              <p className="track-description">{lugarActivo.detalle}</p>
              <p className="curation-note">El vínculo entre la música y este lugar está pendiente de verificación.</p>
              <a
                className="listen-link"
                href={`https://www.youtube.com/results?search_query=${busquedaMusical}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="listen-icon" aria-hidden="true">↗</span>
                Explorar canciones
              </a>
            </div>
            <div className="panel-coordinates">
              <span>COLONIA DEL SACRAMENTO</span>
              <span>{Math.abs(lugarActivo.coordenadas[0]).toFixed(4)}° S</span>
            </div>
          </aside>
        </div>

        <nav className="place-list" aria-label="Lugares destacados">
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
        </nav>
      </section>

      <footer className="site-footer">
        <span>COLONIA SONORA <span className="footer-separator">/</span> ARCHIVO MUSICAL EN CONSTRUCCIÓN</span>
        <a href="#inicio">VOLVER AL MAPA ↑</a>
      </footer>
    </main>
  );
}

export default App;
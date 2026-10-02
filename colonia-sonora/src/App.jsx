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
    detalle: 'Canciones para escuchar junto al río y relatos musicales de la rambla.',
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

  const busquedaMusical = encodeURIComponent(`${lugarActivo.nombre} Colonia del Sacramento música canción`);

  return (
    <main className="sonora-app">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Colonia Sonora, inicio">
          <span className="brand-mark" aria-hidden="true">cs</span>
          <span className="brand-name">colonia<span>sonora</span></span>
        </a>
        <div className="header-note"><span className="live-dot" /> UN MAPA PARA ESCUCHAR
          <span className="header-place">Colonia del Sacramento, Uruguay</span>
        </div>
      </header>

      <section className="explorer" id="inicio" aria-labelledby="page-title">
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
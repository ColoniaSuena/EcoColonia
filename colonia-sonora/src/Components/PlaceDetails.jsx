function PlaceDetails({
  lugarActivo,
  indiceLugarActivo,
  lugaresVisibles,
  lugares,
  esArtista,
  cancionActiva,
  busquedaMusical,
}) {
  return (
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
  );
}

export default PlaceDetails;

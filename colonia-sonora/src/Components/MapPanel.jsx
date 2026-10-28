import Mapacolonia from './Mapacolonia.jsx';

function MapPanel({ lugaresVisibles, lugarActivoId, onSelect }) {
  return (
    <div className="map-frame" aria-label="Mapa interactivo de Colonia del Sacramento">
      <Mapacolonia
        lugares={lugaresVisibles}
        lugarActivoId={lugarActivoId}
        onSelect={onSelect}
      />
      <div className="map-legend" aria-label="Referencias del mapa">
        <span><i className="map-legend-dot is-song" /> Canciones</span>
        <span><i className="map-legend-dot is-video" /> Videoclips</span>
        <span><i className="map-legend-dot is-artist" /> Artistas</span>
      </div>
      <div className="map-stamp" aria-hidden="true"><span>34°28′S</span><span>57°50′W</span></div>
    </div>
  );
}

export default MapPanel;

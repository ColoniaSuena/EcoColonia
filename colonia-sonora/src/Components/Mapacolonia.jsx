import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapaColonia({ lugares, lugarActivoId, onSelect }) {
  const posicion = [-34.46, -57.85];

  return (
    <MapContainer
      center={posicion}
      zoom={13}
      scrollWheelZoom={false}
      className="leaflet-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {lugares.map((lugar) => {
        const seleccionado = lugar.id === lugarActivoId;
        return (
          <CircleMarker
            key={lugar.id}
            center={lugar.coordenadas}
            radius={seleccionado ? 10 : 7}
            pathOptions={{
              color: '#f6f3e8',
              weight: seleccionado ? 4 : 2,
              fillColor: seleccionado ? '#d6533e' : '#173f45',
              fillOpacity: 1,
            }}
            eventHandlers={{ click: () => onSelect(lugar.id) }}
          >
            <Popup>
              <strong>{lugar.nombre}</strong>
              <br />
              {lugar.tipo}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

export default MapaColonia;
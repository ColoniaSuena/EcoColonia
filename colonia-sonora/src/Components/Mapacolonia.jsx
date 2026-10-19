import { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const posicionColonia = [-34.46, -57.85];

const coloresPorCategoria = {
  cancion: '#173f45',
  videoclip: '#d39c38',
  artista: '#d6533e',
};

function EnfocarLugar({ latitud, longitud }) {
  const mapa = useMap();

  useEffect(() => {
    mapa.flyTo([latitud, longitud], Math.max(mapa.getZoom(), 13), { duration: 0.5 });
  }, [latitud, longitud, mapa]);

  return null;
}

function CapturarCoordenadas({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
}

function MapaColonia({ lugares, lugarActivoId, onSelect }) {
  const lugarActivo = lugares.find((lugar) => lugar.id === lugarActivoId);

  return (
    <MapContainer
      center={lugarActivo?.coordenadas ?? posicionColonia}
      zoom={13}
      scrollWheelZoom={false}
      className="leaflet-map"
    >
      {lugarActivo && <EnfocarLugar latitud={lugarActivo.coordenadas[0]} longitud={lugarActivo.coordenadas[1]} />}
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
            radius={seleccionado ? 11 : lugar.categoria === 'artista' ? 9 : 7}
            pathOptions={{
              color: '#f6f3e8',
              weight: seleccionado ? 4 : 2,
              fillColor: coloresPorCategoria[lugar.categoria] ?? '#173f45',
              fillOpacity: 1,
            }}
            eventHandlers={{ click: () => onSelect(lugar.id) }}
          >
            <Popup>
              <strong>{lugar.nombre}</strong>
              <br />
              {lugar.tipo}
              {lugar.detalle && <><br />{lugar.detalle}</>}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

export function SelectorCoordenadas({ coordenadas, onSelect }) {
  const latitud = Number(coordenadas[0]);
  const longitud = Number(coordenadas[1]);
  const tieneCoordenadas = coordenadas[0] !== '' && coordenadas[1] !== ''
    && Number.isFinite(latitud) && Number.isFinite(longitud);
  const posicion = tieneCoordenadas
    ? [latitud, longitud]
    : posicionColonia;

  return (
    <MapContainer
      center={posicion}
      zoom={tieneCoordenadas ? 15 : 13}
      scrollWheelZoom={false}
      className="location-picker-map"
    >
      <EnfocarLugar latitud={posicion[0]} longitud={posicion[1]} />
      <CapturarCoordenadas onSelect={onSelect} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {tieneCoordenadas && (
        <CircleMarker
          center={posicion}
          radius={8}
          pathOptions={{ color: '#f6f3e8', weight: 3, fillColor: '#d6533e', fillOpacity: 1 }}
        />
      )}
    </MapContainer>
  );
}

export default MapaColonia;
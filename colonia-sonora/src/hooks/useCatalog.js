import { useCallback, useEffect, useState } from 'react';

function useCatalog({ supabase, initialPlaces = [] }) {
  const [lugares, setLugares] = useState(initialPlaces);
  const [canciones, setCanciones] = useState([]);
  const [recorridos, setRecorridos] = useState([]);
  const [errorCatalogo, setErrorCatalogo] = useState('');

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
        return {
          places: lugaresCargados,
          selectedId: lugarSeleccionadoId,
        };
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

  return {
    lugares,
    setLugares,
    canciones,
    setCanciones,
    recorridos,
    setRecorridos,
    errorCatalogo,
    cargarCatalogo,
  };
}

export default useCatalog;

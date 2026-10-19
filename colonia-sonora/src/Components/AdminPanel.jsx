import { useCallback, useEffect, useState } from 'react';
import { SelectorCoordenadas } from './Mapacolonia.jsx';

const tabs = [
  { id: 'locations', label: 'Lugares' },
  { id: 'songs', label: 'Canciones' },
  { id: 'routes', label: 'Recorridos' },
];

const blankLocation = {
  name: '',
  category: 'cancion',
  type: '',
  latitude: '',
  longitude: '',
  details: '',
  is_active: true,
};

const blankSong = {
  title: '',
  artist: '',
  url: '',
  description: '',
  location_id: '',
  is_active: true,
};

const blankRoute = {
  name: '',
  description: '',
  is_active: true,
  location_ids: [],
};

function AdminPanel({ locations, onClose, onCatalogChanged, supabase }) {
  const [activeTab, setActiveTab] = useState('locations');
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(blankLocation);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadRecords = useCallback(async (tab = activeTab) => {
    if (!supabase) {
      setError('No se pudo conectar con Supabase. Revisá las variables de entorno.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const table = tab === 'locations' ? 'locations' : tab;
      const { data, error: queryError } = await supabase
        .from(table)
        .select('*')
        .order(tab === 'songs' ? 'title' : 'name');
      if (queryError) throw queryError;
      if (tab === 'routes') {
        const { data: stops, error: stopsError } = await supabase
          .from('route_stops')
          .select('route_id, location_id, position')
          .order('position');
        if (stopsError) throw stopsError;
        setRecords(data.map((route) => ({
          ...route,
          location_ids: stops.filter((stop) => stop.route_id === route.id).map((stop) => stop.location_id),
        })));
      } else {
        setRecords(data);
      }
    } catch (queryError) {
      setError(queryError.message || 'No se pudo cargar el contenido.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, supabase]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) void loadRecords(activeTab);
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activeTab, loadRecords]);

  function chooseTab(tabId) {
    setActiveTab(tabId);
    setEditingId(null);
    setForm(tabId === 'locations' ? blankLocation : tabId === 'songs' ? blankSong : blankRoute);
    setError('');
    setNotice('');
  }

  function editRecord(record) {
    setEditingId(record.id);
    if (activeTab === 'locations') {
      setForm({
        name: record.name,
        category: record.category,
        type: record.type,
        latitude: record.latitude,
        longitude: record.longitude,
        details: record.details ?? '',
        is_active: record.is_active,
      });
    } else if (activeTab === 'songs') {
      setForm({
        title: record.title,
        artist: record.artist ?? '',
        url: record.url ?? '',
        description: record.description ?? '',
        location_id: record.location_id ?? '',
        is_active: record.is_active,
      });
    } else {
      setForm({
        name: record.name,
        description: record.description ?? '',
        is_active: record.is_active,
        location_ids: record.location_ids,
      });
    }
    setError('');
    setNotice('');
  }

  async function saveRecord(event) {
    event.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const table = activeTab === 'locations' ? 'locations' : activeTab;
      const payload = activeTab === 'locations'
        ? {
          ...form,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        }
        : activeTab === 'songs'
          ? { ...form, location_id: form.location_id || null }
          : { name: form.name, description: form.description, is_active: form.is_active };
      let query = supabase.from(table);
      if (editingId) query = query.update(payload).eq('id', editingId);
      else query = query.insert(payload);
      const { data, error: saveError } = await query.select('id').single();
      if (saveError) throw saveError;
      if (activeTab === 'routes') {
        const { error: stopsError } = await supabase.rpc('replace_route_stops', {
          p_route_id: data.id,
          p_location_ids: form.location_ids,
        });
        if (stopsError) throw stopsError;
      }
      setNotice(editingId ? 'Se guardaron los cambios.' : 'Se creó el registro.');
      setEditingId(null);
      setForm(activeTab === 'locations' ? blankLocation : activeTab === 'songs' ? blankSong : blankRoute);
      await loadRecords(activeTab);
      if (activeTab === 'locations') await onCatalogChanged(data.id);
    } catch (saveError) {
      setError(saveError.message || 'No se pudo guardar el registro.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecord(record) {
    if (!supabase || !window.confirm(`¿Eliminar "${record.name || record.title}"? Esta acción no se puede deshacer.`)) return;
    setError('');
    setNotice('');
    try {
      const { error: deleteError } = await supabase.from(activeTab).delete().eq('id', record.id);
      if (deleteError) throw deleteError;
      if (editingId === record.id) {
        setEditingId(null);
        setForm(activeTab === 'locations' ? blankLocation : activeTab === 'songs' ? blankSong : blankRoute);
      }
      setNotice('Se eliminó el registro.');
      await loadRecords(activeTab);
      if (activeTab === 'locations') onCatalogChanged();
    } catch (deleteError) {
      setError(deleteError.message || 'No se pudo eliminar el registro.');
    }
  }

  const selectedTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="account-overlay admin-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        <header className="admin-header">
          <div>
            <p className="eyebrow">ECOS COLONIA</p>
            <h2 id="admin-title">Administración</h2>
          </div>
          <button className="account-close" type="button" aria-label="Cerrar" onClick={onClose}>×</button>
        </header>
        <div className="admin-tabs" role="tablist" aria-label="Tipo de contenido">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={tab.id === activeTab}
              className={tab.id === activeTab ? 'is-active' : ''}
              onClick={() => chooseTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="admin-content">
          <div className="admin-records">
            <div className="admin-list-heading">
              <h3>{selectedTab.label}</h3>
              <span>{records.length}</span>
            </div>
            {loading && <p className="admin-empty">Cargando…</p>}
            {!loading && records.length === 0 && <p className="admin-empty">Todavía no hay registros.</p>}
            {!loading && records.map((record) => (
              <article className={`admin-record${editingId === record.id ? ' is-selected' : ''}`} key={record.id}>
                <button className="admin-record-name" type="button" onClick={() => editRecord(record)}>
                  <strong>{record.name || record.title}</strong>
                  <span>{record.category ? `${record.category} · ` : ''}{record.is_active ? 'Publicado' : 'Oculto'}</span>
                </button>
                <button className="admin-delete" type="button" aria-label={`Eliminar ${record.name || record.title}`} onClick={() => deleteRecord(record)}>×</button>
              </article>
            ))}
          </div>
          <form className="admin-form" onSubmit={saveRecord}>
            <h3>
              {editingId ? 'Editar' : 'Nuevo'}{' '}
              {activeTab === 'locations'
                ? form.category === 'artista' ? 'artista' : 'punto del mapa'
                : activeTab === 'songs' ? 'canción' : 'recorrido'}
            </h3>
            {activeTab === 'locations' && (
              <>
                <label htmlFor="location-name">{form.category === 'artista' ? 'Nombre del artista' : 'Nombre del punto'}</label>
                <input id="location-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <label htmlFor="location-category">Categoría</label>
                <select id="location-category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                  <option value="cancion">Canción</option><option value="videoclip">Videoclip</option><option value="artista">Artista</option>
                </select>
                <label htmlFor="location-type">{form.category === 'artista' ? 'Referencia' : 'Tipo de punto'}</label>
                <input
                  id="location-type"
                  required
                  placeholder={form.category === 'artista' ? 'Ej.: Artista de Colonia' : 'Ej.: Canción sobre el lugar'}
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value })}
                />
                <div className="admin-coordinate-fields">
                  <div><label htmlFor="location-latitude">Latitud</label><input id="location-latitude" type="number" step="any" min="-90" max="90" required value={form.latitude} onChange={(event) => setForm({ ...form, latitude: event.target.value })} /></div>
                  <div><label htmlFor="location-longitude">Longitud</label><input id="location-longitude" type="number" step="any" min="-180" max="180" required value={form.longitude} onChange={(event) => setForm({ ...form, longitude: event.target.value })} /></div>
                </div>
                <p className="location-picker-hint">Tocá el mapa para fijar el punto; también podés escribir las coordenadas.</p>
                <SelectorCoordenadas
                  coordenadas={[form.latitude, form.longitude]}
                  onSelect={([latitude, longitude]) => setForm({
                    ...form,
                    latitude: latitude.toFixed(6),
                    longitude: longitude.toFixed(6),
                  })}
                />
                <label htmlFor="location-details">Descripción</label>
                <textarea id="location-details" rows="3" value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} />
              </>
            )}
            {activeTab === 'songs' && (
              <>
                <label htmlFor="song-title">Título</label>
                <input id="song-title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
                <label htmlFor="song-artist">Artista</label>
                <input id="song-artist" value={form.artist} onChange={(event) => setForm({ ...form, artist: event.target.value })} />
                <label htmlFor="song-url">Enlace</label>
                <input id="song-url" type="url" placeholder="https://" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} />
                <label htmlFor="song-location">Lugar relacionado</label>
                <select id="song-location" value={form.location_id} onChange={(event) => setForm({ ...form, location_id: event.target.value })}>
                  <option value="">Sin lugar asociado</option>
                  {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
                </select>
                <label htmlFor="song-description">Descripción</label>
                <textarea id="song-description" rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </>
            )}
            {activeTab === 'routes' && (
              <>
                <label htmlFor="route-name">Nombre</label>
                <input id="route-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <label htmlFor="route-description">Descripción</label>
                <textarea id="route-description" rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                <fieldset className="route-stop-picker">
                  <legend>Paradas del recorrido</legend>
                  {locations.map((location) => (
                    <label key={location.id}>
                      <input
                        type="checkbox"
                        checked={form.location_ids.includes(location.id)}
                        onChange={(event) => setForm({
                          ...form,
                          location_ids: event.target.checked
                            ? [...form.location_ids, location.id]
                            : form.location_ids.filter((id) => id !== location.id),
                        })}
                      />
                      {location.name}
                    </label>
                  ))}
                  {locations.length === 0 && <span>Primero agregá lugares.</span>}
                </fieldset>
              </>
            )}
            <label className="admin-published">
              <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
              Publicado
            </label>
            {error && <p className="account-message is-error" role="alert">{error}</p>}
            {notice && <p className="account-message" role="status">{notice}</p>}
            <div className="admin-form-actions">
              {editingId && <button className="admin-cancel" type="button" onClick={() => { setEditingId(null); setForm(activeTab === 'locations' ? blankLocation : activeTab === 'songs' ? blankSong : blankRoute); }}>Cancelar</button>}
              <button className="account-submit" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AdminPanel;

function RoutesModal({ recorridos, lugares, onClose }) {
  return (
    <div className="account-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="account-dialog routes-dialog" role="dialog" aria-modal="true" aria-labelledby="routes-title">
        <button className="account-close" type="button" aria-label="Cerrar" onClick={onClose}>×</button>
        <p className="eyebrow">Ecos de Colonia</p>
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
  );
}

export default RoutesModal;

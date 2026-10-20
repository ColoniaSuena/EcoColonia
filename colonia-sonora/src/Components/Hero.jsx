function Hero({ onExplore }) {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-content">
        <h1 id="hero-title">DESCUBRÍ COLONIA</h1>
        <p>A TRAVÉS DE LA MÚSICA</p>
        <button className="hero-cta" type="button" onClick={() => onExplore()}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 18s6-5.7 6-10a6 6 0 1 0-12 0c0 4.3 6 10 6 10Z" /><circle cx="10" cy="8" r="2" /></svg>
          EXPLORAR MAPA
        </button>
      </div>
    </section>
  );
}

export default Hero;

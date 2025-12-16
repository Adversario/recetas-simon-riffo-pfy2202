import React, { useEffect, useState } from 'react';
import { obtenerDetalleReceta } from '../api/recetasApi';

function DetalleReceta({ recetaId, onVolver }) {
  const [receta, setReceta] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(false);

    obtenerDetalleReceta(recetaId)
      .then((data) => setReceta(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [recetaId]);

  return (
    <main className="app">
      <header className="app__header">
        <div className="container headerRow">
          <div>
            <h1 className="title">Detalle de receta</h1>
            <p className="subtitle">Detalle obtenido por GraphQL (mock)</p>
          </div>

          <button type="button" className="btn" onClick={onVolver}>
            Volver
          </button>
        </div>
      </header>

      <section className="container content" aria-label="Detalle de receta">
        {loading && (
          <div className="card" role="status" aria-live="polite">
            <p className="muted">Cargando detalle...</p>
          </div>
        )}

        {!loading && error && (
          <div className="card card--error" role="alert">
            <p className="errorTitle">Error</p>
            <p className="muted">No se pudo cargar el detalle de la receta.</p>
          </div>
        )}

        {!loading && !error && receta && (
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">{receta.nombre}</h2>
              <span className="pill">#{receta.id}</span>
            </div>

            <div className="grid">
              <div className="kv">
                <span className="kv__k">Dificultad</span>
                <span className="kv__v">{receta.dificultad}</span>
              </div>
              <div className="kv">
                <span className="kv__k">Categoría</span>
                <span className="kv__v">{receta.categoria}</span>
              </div>
              <div className="kv">
                <span className="kv__k">Tiempo</span>
                <span className="kv__v">{receta.tiempoCoccionMin} min</span>
              </div>
            </div>

            <h3 className="sectionTitle">Ingredientes</h3>
            <ul className="bullets">
              {receta.ingredientes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>

            <h3 className="sectionTitle">Preparación</h3>
            <p className="paragraph">{receta.preparacion}</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default DetalleReceta;
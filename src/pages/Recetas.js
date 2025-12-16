import React, { useEffect, useState } from 'react';
import { obtenerRecetas } from '../api/recetasApi';

function Recetas({ onSeleccionar }) {
  const [recetas, setRecetas] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerRecetas()
      .then((data) => setRecetas(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="app">
      <header className="app__header">
        <div className="container">
          <h1 className="title">Base de datos de recetas</h1>
          <p className="subtitle">Listado de recetas (REST mock)</p>
        </div>
      </header>

      <section className="container content" aria-label="Listado de recetas">
        {loading && (
          <div className="card" role="status" aria-live="polite">
            <p className="muted">Cargando recetas...</p>
          </div>
        )}

        {!loading && error && (
          <div className="card card--error" role="alert">
            <p className="errorTitle">Error</p>
            <p className="muted">No se pudieron cargar las recetas.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">Listado</h2>
              <span className="pill" aria-label="Total de recetas">
                {recetas.length} receta{recetas.length === 1 ? '' : 's'}
              </span>
            </div>

            <ul className="list">
              {recetas.map((receta) => (
                <li key={receta.id} className="list__item">
                  <button
                    type="button"
                    className="item__button"
                    onClick={() => onSeleccionar(receta.id)}
                    aria-label={`Ver detalle de ${receta.nombre}`}
                  >
                    <div className="item__main">
                      <span className="item__name">{receta.nombre}</span>
                      <span className="item__meta">
                        Dificultad: {receta.dificultad} · Categoría: {receta.categoria}
                      </span>
                    </div>
                    <span className="item__id">#{receta.id}</span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="hint">Haz clic en una receta para ver su detalle (GraphQL mock).</p>
          </div>
        )}
      </section>

      <footer className="footer">
        <div className="container">
          <span className="muted">PFY2202 · Semana 8 · MSW + Testing</span>
        </div>
      </footer>
    </main>
  );
}

export default Recetas;
import React, { useState } from 'react';
import './App.css';
import Recetas from './pages/Recetas';
import DetalleReceta from './pages/DetalleReceta';

function App() {
  const [seleccionadaId, setSeleccionadaId] = useState(null);

  if (seleccionadaId !== null) {
    return (
      <DetalleReceta
        recetaId={seleccionadaId}
        onVolver={() => setSeleccionadaId(null)}
      />
    );
  }

  return <Recetas onSeleccionar={(id) => setSeleccionadaId(id)} />;
}

export default App;
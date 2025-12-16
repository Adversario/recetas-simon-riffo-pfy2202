import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * MSW se usa para mockear integraciones (pauta).
 * Para pruebas E2E con Cypress, desactivamos MSW porque Cypress puede no "ver"
 * requests servidos por Service Worker y usamos cy.intercept en los specs.
 */
async function prepararMocks() {
  const esDev = process.env.NODE_ENV === 'development';
  const esCypress = typeof window !== 'undefined' && Boolean(window.Cypress);

  if (esDev && !esCypress) {
    const { worker } = await import('./mocks/browser');
    await worker.start();
  }
}

prepararMocks().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
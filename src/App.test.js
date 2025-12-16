import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('la aplicación renderiza', async () => {
  render(<App />);
  // En listado, siempre existe el título principal
  expect(await screen.findByText(/Base de datos de recetas/i)).toBeInTheDocument();
});
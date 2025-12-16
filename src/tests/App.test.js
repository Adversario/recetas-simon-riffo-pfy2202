import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest, graphql } from 'msw';
import { server } from '../mocks/server';
import App from '../App';

describe('App - Recetas (REST) y Detalle (GraphQL)', () => {
  test('muestra el listado de recetas (REST) y permite abrir el detalle (GraphQL)', async () => {
    render(<App />);

    expect(screen.getByText(/Cargando recetas/i)).toBeInTheDocument();

    // Listado
    expect(await screen.findByText('Paella')).toBeInTheDocument();
    expect(screen.getByText('Lasagna')).toBeInTheDocument();

    // Ir a detalle
    await userEvent.click(screen.getByRole('button', { name: /Ver detalle de Paella/i }));

    expect(await screen.findByText(/Detalle de receta/i)).toBeInTheDocument();
    expect(screen.getByText('Ingredientes')).toBeInTheDocument();

    // Verificar "Arroz" específicamente dentro de la lista de ingredientes
    const listaIngredientes = screen.getByRole('list');
    expect(within(listaIngredientes).getByText('Arroz')).toBeInTheDocument();

    // Volver
    await userEvent.click(screen.getByRole('button', { name: /Volver/i }));
    expect(await screen.findByText(/Listado de Recetas/i)).toBeInTheDocument();
  });

  test('maneja error en REST y muestra mensaje de error', async () => {
    server.use(
      rest.get('/api/recetas', (req, res, ctx) => res(ctx.status(500)))
    );

    render(<App />);

    expect(await screen.findByText(/Error/i)).toBeInTheDocument();
    expect(screen.getByText(/No se pudieron cargar las recetas/i)).toBeInTheDocument();
  });

  test('maneja error en GraphQL y muestra mensaje de error en detalle', async () => {
    render(<App />);

    expect(await screen.findByText('Paella')).toBeInTheDocument();

    server.use(
      graphql.query('GetReceta', (req, res, ctx) => {
        return res(
          ctx.data({ receta: null }),
          ctx.errors([{ message: 'Receta no encontrada' }])
        );
      })
    );

    await userEvent.click(screen.getByRole('button', { name: /Ver detalle de Paella/i }));

    expect(await screen.findByText(/No se pudo cargar el detalle/i)).toBeInTheDocument();
  });
});
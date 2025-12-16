import { rest, graphql } from 'msw';

const recetas = [
  { id: 1, nombre: 'Paella', dificultad: 'Media', categoria: 'Plato principal' },
  { id: 2, nombre: 'Lasagna', dificultad: 'Alta', categoria: 'Plato principal' }
];

const detallesPorId = {
  '1': {
    id: '1',
    nombre: 'Paella',
    dificultad: 'Media',
    categoria: 'Plato principal',
    tiempoCoccionMin: 45,
    ingredientes: ['Arroz', 'Caldo', 'Mariscos', 'Azafrán'],
    preparacion: 'Sofreír, añadir arroz y caldo, cocinar y reposar.'
  },
  '2': {
    id: '2',
    nombre: 'Lasagna',
    dificultad: 'Alta',
    categoria: 'Plato principal',
    tiempoCoccionMin: 60,
    ingredientes: ['Pasta', 'Salsa boloñesa', 'Bechamel', 'Queso'],
    preparacion: 'Armar capas, hornear y dejar reposar antes de servir.'
  }
};

export const handlers = [
  // REST: listado
  rest.get('/api/recetas', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(recetas));
  }),

  // GraphQL: detalle
  graphql.query('GetReceta', (req, res, ctx) => {
    const id = String(req.variables?.id ?? '');
    const receta = detallesPorId[id];

    if (!receta) {
      return res(
        ctx.data({ receta: null }),
        ctx.errors([{ message: 'Receta no encontrada' }])
      );
    }

    return res(ctx.data({ receta }));
  })
];
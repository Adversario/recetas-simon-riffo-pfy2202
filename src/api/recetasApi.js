import { fetchGraphQL } from './graphqlClient';

export async function obtenerRecetas() {
  const response = await fetch('/api/recetas');
  if (!response.ok) {
    throw new Error('Error al obtener recetas');
  }
  return response.json();
}

export async function obtenerDetalleReceta(id) {
  const query = `
    query GetReceta($id: ID!) {
      receta(id: $id) {
        id
        nombre
        dificultad
        categoria
        tiempoCoccionMin
        ingredientes
        preparacion
      }
    }
  `;

  const data = await fetchGraphQL({
    query,
    variables: { id: String(id) }
  });

  if (!data || !data.receta) {
    throw new Error('Receta no encontrada');
  }

  return data.receta;
}
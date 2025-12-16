export async function fetchGraphQL({ query, variables }) {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error('Error al consultar GraphQL');
  }

  const payload = await response.json();

  if (payload.errors && payload.errors.length > 0) {
    throw new Error('Error GraphQL');
  }

  return payload.data;
}
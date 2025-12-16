// Cypress E2E - Semana 8 (PFY2202)
// Backend 100% mock en E2E usando cy.intercept (REST + GraphQL).
// Nota: en algunos casos Cypress entrega req.body como string, por eso se parsea.

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

function normalizarBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

describe('Recetas - E2E (Semana 8)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/recetas', {
      statusCode: 200,
      body: recetas
    }).as('getRecetas');

    cy.intercept('POST', '**/graphql', (req) => {
      const body = normalizarBody(req.body);
      const op = body.operationName;
      const query = body.query || '';
      const id = String(body.variables?.id ?? '');

      const esGetReceta = op === 'GetReceta' || query.includes('GetReceta');

      if (esGetReceta) {
        const receta = detallesPorId[id];
        if (!receta) {
          req.reply({
            statusCode: 200,
            body: { data: { receta: null }, errors: [{ message: 'Receta no encontrada' }] }
          });
          return;
        }

        req.reply({
          statusCode: 200,
          body: { data: { receta } }
        });
        return;
      }

      // Para esta actividad, cualquier otra operación GraphQL no debería ocurrir.
      // Aun así, respondemos 200 para evitar que el test falle por red.
      req.reply({ statusCode: 200, body: { data: {} } });
    }).as('postGraphql');

    cy.visit('http://localhost:3000');
    cy.wait('@getRecetas', { timeout: 10000 });
  });

  it('E2E-01: carga el listado de recetas (REST mock)', () => {
    cy.contains('Base de datos de recetas').should('be.visible');
    cy.contains('Paella').should('be.visible');
    cy.contains('Lasagna').should('be.visible');
  });

  it('E2E-02: al hacer click en una receta muestra el detalle (GraphQL mock)', () => {
    cy.get('button[aria-label="Ver detalle de Paella"]').click();
    cy.wait('@postGraphql', { timeout: 10000 });

    cy.contains('Detalle de receta').should('be.visible');
    cy.contains('Paella').should('be.visible');
    cy.contains('Ingredientes').should('be.visible');
    cy.contains('Arroz').should('be.visible');
  });

  it('E2E-03: desde detalle permite volver al listado', () => {
    cy.get('button[aria-label="Ver detalle de Paella"]').click();
    cy.wait('@postGraphql', { timeout: 10000 });

    cy.contains('Detalle de receta').should('be.visible');
    cy.get('button.btn').contains('Volver').click();

    cy.contains('Base de datos de recetas').should('be.visible');
    cy.contains('Paella').should('be.visible');
    cy.contains('Lasagna').should('be.visible');
  });

  it('E2E-04: flujo completo usuario (listar → detalle → volver)', () => {
    cy.get('button[aria-label="Ver detalle de Lasagna"]').click();
    cy.wait('@postGraphql', { timeout: 10000 });

    cy.contains('Detalle de receta').should('be.visible');
    cy.contains('Lasagna').should('be.visible');
    cy.contains('Preparación').should('be.visible');

    cy.get('button.btn').contains('Volver').click();
    cy.contains('Base de datos de recetas').should('be.visible');
  });
});
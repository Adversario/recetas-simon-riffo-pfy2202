import '@testing-library/jest-dom';
import { server } from './mocks/server';

// MSW en entorno de pruebas (Jest)
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
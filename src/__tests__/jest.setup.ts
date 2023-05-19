import 'reflect-metadata'; // Necessary import for InversifyJS (dependency injection).

afterAll(async () => {
    jest.restoreAllMocks();
});
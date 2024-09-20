import SwiftFetch from "../src/SwiftFetch";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('SwiftFetch', () => {
  let swiftFetch: SwiftFetch;

  beforeEach(() => {
    swiftFetch = new SwiftFetch({ baseURL: 'https://jsonplaceholder.typicode.com' });
    mockFetch.mockClear();
  });

  it('should make a GET request successfully', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue({ id: 1, title: 'Test Todo' }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const response = await swiftFetch.get('/todos/1');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/todos/1',
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Object),
      })
    );
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ id: 1, title: 'Test Todo' });
  });

  it('should make a POST request successfully', async () => {
    const mockResponse = {
      ok: true,
      status: 201,
      statusText: 'Created',
      json: jest.fn().mockResolvedValue({ id: 101, title: 'New Todo', completed: false }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const newTodo = { title: 'New Todo', completed: false };
    const response = await swiftFetch.post('/todos', newTodo);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/todos',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(newTodo),
      })
    );
    expect(response.status).toBe(201);
    expect(response.data).toEqual({ id: 101, title: 'New Todo', completed: false });
  });
});
const request = require('supertest');
const app = require('../src/server');

describe('Health Check', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Todos API', () => {
  test('GET /todos returns empty array initially', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /todos creates a todo', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 'Learn DevOps' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Learn DevOps');
    expect(res.body.done).toBe(false);
  });

  test('POST /todos without title returns 400', async () => {
    const res = await request(app).post('/todos').send({});
    expect(res.statusCode).toBe(400);
  });

  test('PUT /todos/:id updates a todo', async () => {
    const created = await request(app)
      .post('/todos')
      .send({ title: 'Learn Docker' });
    const res = await request(app)
      .put(`/todos/${created.body.id}`)
      .send({ done: true });
    expect(res.body.done).toBe(true);
  });

  test('DELETE /todos/:id deletes a todo', async () => {
    const created = await request(app)
      .post('/todos')
      .send({ title: 'Learn Kubernetes' });
    const res = await request(app)
      .delete(`/todos/${created.body.id}`);
    expect(res.statusCode).toBe(204);
  });

  test('GET /todos/:id not found returns 404', async () => {
    const res = await request(app).put('/todos/9999').send({ done: true });
    expect(res.statusCode).toBe(404);
  });
});

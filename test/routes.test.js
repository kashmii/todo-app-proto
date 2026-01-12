import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import todosRouter from '../routes/todos.js';
import { createTodo, getAllTodos } from '../db.js';

// テスト用のExpressアプリを作成
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/todos', todosRouter);
  return app;
};

describe('Todos API Routes', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('GET /api/todos', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all todos', async () => {
      createTodo('Todo 1');
      createTodo('Todo 2');

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: 'New todo' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.text).toBe('New todo');
      expect(response.body.completed).toBe(0);
    });

    it('should trim whitespace from todo text', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: '  Spaced todo  ' });

      expect(response.status).toBe(201);
      expect(response.body.text).toBe('Spaced todo');
    });

    it('should return 400 when text is missing', async () => {
      const response = await request(app).post('/api/todos').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when text is empty', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when text is only whitespace', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update todo text', async () => {
      const id = createTodo('Original text');

      const response = await request(app)
        .put(`/api/todos/${id}`)
        .send({ text: 'Updated text' });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('Updated text');
      expect(response.body.completed).toBe(0);
    });

    it('should update todo completed status', async () => {
      const id = createTodo('Test todo');

      const response = await request(app)
        .put(`/api/todos/${id}`)
        .send({ completed: 1 });

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(1);
      expect(response.body.text).toBe('Test todo');
    });

    it('should update both text and completed status', async () => {
      const id = createTodo('Original text');

      const response = await request(app)
        .put(`/api/todos/${id}`)
        .send({ text: 'Updated text', completed: 1 });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('Updated text');
      expect(response.body.completed).toBe(1);
    });

    it('should trim whitespace when updating text', async () => {
      const id = createTodo('Original text');

      const response = await request(app)
        .put(`/api/todos/${id}`)
        .send({ text: '  Trimmed  ' });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('Trimmed');
    });

    it('should return 404 when todo does not exist', async () => {
      const response = await request(app)
        .put('/api/todos/99999')
        .send({ text: 'Updated text' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when text is empty string', async () => {
      const id = createTodo('Original text');

      const response = await request(app)
        .put(`/api/todos/${id}`)
        .send({ text: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when text is only whitespace', async () => {
      const id = createTodo('Original text');

      const response = await request(app)
        .put(`/api/todos/${id}`)
        .send({ text: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const id = createTodo('Test todo');

      const response = await request(app).delete(`/api/todos/${id}`);

      expect(response.status).toBe(204);

      const todos = getAllTodos();
      expect(todos.find((t) => t.id === id)).toBeUndefined();
    });

    it('should return 404 when todo does not exist', async () => {
      const response = await request(app).delete('/api/todos/99999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});

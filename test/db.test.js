import { describe, it, expect } from 'vitest';
import {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
} from '../db.js';

describe('Database Operations', () => {
  describe('createTodo', () => {
    it('should create a new todo', () => {
      const text = 'Test todo';
      const id = createTodo(text);

      expect(id).toBeGreaterThan(0);

      const todo = getTodoById(id);
      expect(todo).toBeDefined();
      expect(todo.text).toBe(text);
      expect(todo.completed).toBe(0);
    });

    it('should create multiple todos', () => {
      const id1 = createTodo('Todo 1');
      const id2 = createTodo('Todo 2');

      expect(id2).toBeGreaterThan(id1);
    });
  });

  describe('getAllTodos', () => {
    it('should return empty array when no todos exist', () => {
      const todos = getAllTodos();
      expect(todos).toEqual([]);
    });

    it('should return all todos', () => {
      createTodo('Todo 1');
      createTodo('Todo 2');
      createTodo('Todo 3');

      const todos = getAllTodos();
      expect(todos).toHaveLength(3);
      expect(todos[0].text).toBe('Todo 3'); // DESC順
      expect(todos[1].text).toBe('Todo 2');
      expect(todos[2].text).toBe('Todo 1');
    });
  });

  describe('getTodoById', () => {
    it('should get todo by id', () => {
      const id = createTodo('Test todo');
      const todo = getTodoById(id);

      expect(todo).toBeDefined();
      expect(todo.id).toBe(id);
      expect(todo.text).toBe('Test todo');
    });

    it('should return undefined for non-existent id', () => {
      const todo = getTodoById(99999);
      expect(todo).toBeUndefined();
    });
  });

  describe('updateTodo', () => {
    it('should update todo text', () => {
      const id = createTodo('Original text');
      updateTodo(id, 'Updated text', undefined);

      const todo = getTodoById(id);
      expect(todo.text).toBe('Updated text');
      expect(todo.completed).toBe(0);
    });

    it('should update todo completed status', () => {
      const id = createTodo('Test todo');
      updateTodo(id, undefined, 1);

      const todo = getTodoById(id);
      expect(todo.text).toBe('Test todo');
      expect(todo.completed).toBe(1);
    });

    it('should update both text and completed status', () => {
      const id = createTodo('Original text');
      updateTodo(id, 'Updated text', 1);

      const todo = getTodoById(id);
      expect(todo.text).toBe('Updated text');
      expect(todo.completed).toBe(1);
    });

    it('should not update if both parameters are undefined', () => {
      const id = createTodo('Original text');
      updateTodo(id, undefined, undefined);

      const todo = getTodoById(id);
      expect(todo.text).toBe('Original text');
      expect(todo.completed).toBe(0);
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo', () => {
      const id = createTodo('Test todo');
      deleteTodo(id);

      const todo = getTodoById(id);
      expect(todo).toBeUndefined();
    });

    it('should delete only the specified todo', () => {
      const id1 = createTodo('Todo 1');
      const id2 = createTodo('Todo 2');
      const id3 = createTodo('Todo 3');

      deleteTodo(id2);

      const todos = getAllTodos();
      expect(todos).toHaveLength(2);
      expect(todos.find((t) => t.id === id1)).toBeDefined();
      expect(todos.find((t) => t.id === id2)).toBeUndefined();
      expect(todos.find((t) => t.id === id3)).toBeDefined();
    });
  });
});

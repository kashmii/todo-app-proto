const express = require('express');
const router = express.Router();
const { getAllTodos, createTodo, updateTodo, deleteTodo, getTodoById } = require('../db');

// 全てのtodoを取得
router.get('/', (req, res) => {
  try {
    const todos = getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

// 新しいtodoを作成
router.post('/', (req, res) => {
  try {
    const { text } = req.body;

    // バリデーション
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Todoのテキストは必須です' });
    }

    const id = createTodo(text.trim());
    const newTodo = getTodoById(id);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Todoの作成に失敗しました' });
  }
});

// todoを更新
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    // IDが存在するか確認
    const existingTodo = getTodoById(id);
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todoが見つかりません' });
    }

    // バリデーション
    if (text !== undefined && text.trim() === '') {
      return res.status(400).json({ error: 'Todoのテキストは空にできません' });
    }

    updateTodo(id, text ? text.trim() : undefined, completed);
    const updatedTodo = getTodoById(id);
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Todoの更新に失敗しました' });
  }
});

// todoを削除
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // IDが存在するか確認
    const existingTodo = getTodoById(id);
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todoが見つかりません' });
    }

    deleteTodo(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Todoの削除に失敗しました' });
  }
});

module.exports = router;

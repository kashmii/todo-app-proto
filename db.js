import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// データベースファイルのパス
const dbPath = path.join(__dirname, 'todos.db');

// データベース接続
const db = new Database(dbPath);

// テーブルの作成
const createTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.exec(sql);
};

// 初期化
createTable();

// データベース操作関数

// 全てのtodoを取得
const getAllTodos = () => {
  const sql = 'SELECT * FROM todos ORDER BY created_at DESC, id DESC';
  return db.prepare(sql).all();
};

// todoを追加
const createTodo = (text) => {
  const sql = 'INSERT INTO todos (text) VALUES (?)';
  const result = db.prepare(sql).run(text);
  return result.lastInsertRowid;
};

// todoを更新
const updateTodo = (id, text, completed) => {
  if (text !== undefined && completed !== undefined) {
    const sql = 'UPDATE todos SET text = ?, completed = ? WHERE id = ?';
    db.prepare(sql).run(text, completed, id);
  } else if (text !== undefined) {
    const sql = 'UPDATE todos SET text = ? WHERE id = ?';
    db.prepare(sql).run(text, id);
  } else if (completed !== undefined) {
    const sql = 'UPDATE todos SET completed = ? WHERE id = ?';
    db.prepare(sql).run(completed, id);
  }
};

// todoを削除
const deleteTodo = (id) => {
  const sql = 'DELETE FROM todos WHERE id = ?';
  db.prepare(sql).run(id);
};

// todoをIDで取得
const getTodoById = (id) => {
  const sql = 'SELECT * FROM todos WHERE id = ?';
  return db.prepare(sql).get(id);
};

export {
  db,
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoById
};

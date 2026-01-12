import { beforeEach, afterEach } from 'vitest';
import { db } from '../db.js';

// 各テストの前にtodosテーブルをクリーンアップ
beforeEach(() => {
  db.exec('DELETE FROM todos');
});

// テストスイート終了時にもクリーンアップ
afterEach(() => {
  db.exec('DELETE FROM todos');
});

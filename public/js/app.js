// DOM要素
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  loadTodos();
});

// Todoの読み込み
async function loadTodos() {
  try {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    renderTodos(todos);
  } catch (error) {
    console.error('Todoの読み込みに失敗しました:', error);
  }
}

// Todoの表示
function renderTodos(todos) {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = '<li class="empty-message">Todoがありません</li>';
    updateTodoCount(0);
    return;
  }

  todos.forEach(todo => {
    const li = createTodoElement(todo);
    todoList.appendChild(li);
  });

  updateTodoCount(todos.length);
}

// Todo要素の作成
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () => toggleTodo(todo.id, checkbox.checked));

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = todo.text;

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = todo.text;

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'todo-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'btn edit-btn';
  editBtn.textContent = '編集';
  editBtn.addEventListener('click', () => startEdit(li, todo));

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn save-btn';
  saveBtn.textContent = '保存';
  saveBtn.addEventListener('click', () => saveEdit(li, todo.id));

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn cancel-btn';
  cancelBtn.textContent = 'キャンセル';
  cancelBtn.addEventListener('click', () => cancelEdit(li, todo.text));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn delete-btn';
  deleteBtn.textContent = '削除';
  deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(saveBtn);
  actionsDiv.appendChild(cancelBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editInput);
  li.appendChild(actionsDiv);

  return li;
}

// Todoの追加
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const text = todoInput.value.trim();
  if (!text) return;

  try {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      todoInput.value = '';
      loadTodos();
    } else {
      const error = await response.json();
      alert(error.error || 'Todoの追加に失敗しました');
    }
  } catch (error) {
    console.error('Todoの追加に失敗しました:', error);
    alert('Todoの追加に失敗しました');
  }
});

// Todoの完了/未完了切り替え
async function toggleTodo(id, completed) {
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: completed ? 1 : 0 }),
    });

    if (response.ok) {
      loadTodos();
    } else {
      alert('Todoの更新に失敗しました');
      loadTodos();
    }
  } catch (error) {
    console.error('Todoの更新に失敗しました:', error);
    alert('Todoの更新に失敗しました');
    loadTodos();
  }
}

// 編集モードの開始
function startEdit(li, todo) {
  const span = li.querySelector('.todo-text');
  const editInput = li.querySelector('.edit-input');
  const editBtn = li.querySelector('.edit-btn');
  const saveBtn = li.querySelector('.save-btn');
  const cancelBtn = li.querySelector('.cancel-btn');

  span.classList.add('editing');
  editInput.classList.add('active');
  editBtn.style.display = 'none';
  saveBtn.classList.add('active');
  cancelBtn.classList.add('active');

  editInput.focus();
  editInput.select();
}

// 編集の保存
async function saveEdit(li, id) {
  const editInput = li.querySelector('.edit-input');
  const newText = editInput.value.trim();

  if (!newText) {
    alert('Todoのテキストを入力してください');
    return;
  }

  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newText }),
    });

    if (response.ok) {
      loadTodos();
    } else {
      const error = await response.json();
      alert(error.error || 'Todoの更新に失敗しました');
    }
  } catch (error) {
    console.error('Todoの更新に失敗しました:', error);
    alert('Todoの更新に失敗しました');
  }
}

// 編集のキャンセル
function cancelEdit(li, originalText) {
  const span = li.querySelector('.todo-text');
  const editInput = li.querySelector('.edit-input');
  const editBtn = li.querySelector('.edit-btn');
  const saveBtn = li.querySelector('.save-btn');
  const cancelBtn = li.querySelector('.cancel-btn');

  span.classList.remove('editing');
  editInput.classList.remove('active');
  editInput.value = originalText;
  editBtn.style.display = 'inline-block';
  saveBtn.classList.remove('active');
  cancelBtn.classList.remove('active');
}

// Todoの削除
async function deleteTodo(id) {
  if (!confirm('このTodoを削除しますか?')) {
    return;
  }

  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      loadTodos();
    } else {
      alert('Todoの削除に失敗しました');
    }
  } catch (error) {
    console.error('Todoの削除に失敗しました:', error);
    alert('Todoの削除に失敗しました');
  }
}

// Todo件数の更新
function updateTodoCount(count) {
  todoCount.textContent = count;
}

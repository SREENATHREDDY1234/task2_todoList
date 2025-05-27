document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const searchInput = document.getElementById('searchInput');
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateStats();
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        li.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <div class="actions">
                <button class="action-btn complete-btn">${todo.completed ? '↻' : '✓'}</button>
                <button class="action-btn delete-btn">×</button>
            </div>
        `;
        return li;
    }

    function renderTodos(filteredTodos = todos) {
        todoList.innerHTML = '';
        filteredTodos.forEach(todo => {
            const todoElement = createTodoElement(todo);
            todoList.appendChild(todoElement);
        });
        updateStats();
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.unshift(newTodo);
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    }

    function toggleComplete(id) {
        todos = todos.map(todo => 
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        );
        saveTodos();
        renderTodos();
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }

    function updateStats() {
        document.getElementById('totalCount').textContent = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('remainingCount').textContent = todos.length - completed;
    }

    function searchTodos(searchText) {
        const filtered = todos.filter(todo => 
            todo.text.toLowerCase().includes(searchText.toLowerCase())
        );
        renderTodos(filtered);
    }

    // Event Listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTodo());

    todoList.addEventListener('click', (e) => {
        const todoItem = e.target.closest('.todo-item');
        if (!todoItem) return;

        const id = parseInt(todoItem.dataset.id);
        if (e.target.classList.contains('complete-btn')) {
            toggleComplete(id);
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTodo(id);
        }
    });

    searchInput.addEventListener('input', (e) => searchTodos(e.target.value));

    // Initial render
    renderTodos();
});
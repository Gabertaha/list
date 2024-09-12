const form = document.getElementById('todo-form');
const taskInput = document.getElementById('new-task');
const todoList = document.getElementById('todo-list');
const notifications = document.getElementById('notifications');

document.addEventListener('DOMContentLoaded', loadTasks);


form.addEventListener('submit', addTask);
todoList.addEventListener('click', handleTaskActions);


function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
}


function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    renderTask(task);
    saveTaskToLocalStorage(task);

    showNotification('Task added successfully');
    taskInput.value = '';
}


function renderTask(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.className = task.completed ? 'completed' : '';

    li.innerHTML = `
        <span>${task.text}</span>
        <div>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
            <button class="complete">${task.completed ? 'Unmark' : 'Complete'}</button>
        </div>
    `;

    todoList.appendChild(li);
}


function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function handleTaskActions(e) {
    const li = e.target.closest('li');
    const id = li.getAttribute('data-id');

    if (e.target.classList.contains('delete')) {
        deleteTask(id);
        li.remove();
        showNotification('Task deleted successfully');
    }

    if (e.target.classList.contains('edit')) {
        const newText = prompt('Edit your task:', li.querySelector('span').textContent);
        if (newText) {
            li.querySelector('span').textContent = newText;
            updateTaskInLocalStorage(id, newText);
            showNotification('Task edited successfully');
        }
    }

    if (e.target.classList.contains('complete')) {
        li.classList.toggle('completed');
        const isCompleted = li.classList.contains('completed');
        e.target.textContent = isCompleted ? 'Unmark' : 'Complete';
        toggleTaskCompleteInLocalStorage(id, isCompleted);
        showNotification(isCompleted ? 'Task marked as complete' : 'Task unmarked');
    }
}


function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function updateTaskInLocalStorage(id, newText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if (task.id == id) {
            task.text = newText;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function toggleTaskCompleteInLocalStorage(id, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if (task.id == id) {
            task.completed = completed;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function showNotification(message) {
    notifications.textContent = message;
    setTimeout(() => {
        notifications.textContent = '';
    }, 2000);
}
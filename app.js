/* app.js */
const loginSection = document.getElementById('loginSection');
const mainApp = document.getElementById('mainApp');
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('usernameInput');
const greeting = document.getElementById('greeting');
const toggleDarkMode = document.getElementById('toggleDarkMode');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const achievementList = document.getElementById('achievementList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let achievements = [];

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    loginSection.style.display = 'none';
    mainApp.style.display = 'block';
    greeting.textContent = `Hai, ${username}!`;
  }
});

toggleDarkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const task = {
    id: Date.now(),
    title: taskText,
    completed: false
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = '';
});

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.title;
    li.draggable = true;
    li.dataset.id = task.id;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.className = 'deleteBtn';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    };

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  setDragAndDrop();
  checkAchievements();
}

function setDragAndDrop() {
  let draggingEl;

  taskList.querySelectorAll('li').forEach(li => {
    li.addEventListener('dragstart', () => {
      draggingEl = li;
      li.classList.add('dragging');
    });
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
    });
    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(taskList, e.clientY);
      if (afterElement == null) {
        taskList.appendChild(draggingEl);
      } else {
        taskList.insertBefore(draggingEl, afterElement);
      }
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function checkAchievements() {
  achievements = [];
  achievementList.innerHTML = '';
  if (tasks.length >= 5) {
    addAchievement('Menambahkan 5 tugas!');
  }
  if (tasks.length >= 10) {
    addAchievement('Menambahkan 10 tugas! Kamu hebat!');
  }
}

function addAchievement(text) {
  if (!achievements.includes(text)) {
    achievements.push(text);
    const li = document.createElement('li');
    li.textContent = text;
    achievementList.appendChild(li);
  }
}

renderTasks();

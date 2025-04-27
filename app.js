const loginSection = document.getElementById('loginSection');
const mainApp = document.getElementById('mainApp');
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const greeting = document.getElementById('greeting');

const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const darkModeToggle = document.getElementById('darkModeToggle');
const achievement = document.getElementById('achievement');

let tasks = [];
let username = '';

/* --------- Login Sederhana --------- */
if (localStorage.getItem('username')) {
  username = localStorage.getItem('username');
  showMainApp();
}

loginBtn.addEventListener('click', function() {
  username = usernameInput.value.trim();
  if (username !== '') {
    localStorage.setItem('username', username);
    showMainApp();
  }
});

logoutBtn.addEventListener('click', function() {
  localStorage.removeItem('username');
  localStorage.removeItem('tasks_' + username);
  location.reload();
});

function showMainApp() {
  loginSection.style.display = 'none';
  mainApp.style.display = 'block';
  greeting.textContent = `Halo, ${username}!`;
  loadTasks();
}

/* --------- Dark Mode --------- */
darkModeToggle.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
});

/* --------- Task Management --------- */
addTaskBtn.addEventListener('click', function() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const newTask = { id: Date.now(), title: taskText, completed: false };
  tasks.push(newTask);
  saveAndRender();

  taskInput.value = '';
  animateNewTask();
});

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.title;
    li.setAttribute('draggable', 'true');
    li.dataset.id = task.id;
    li.classList.add('fade-in');
    if (task.completed) li.classList.add('completed');

    li.addEventListener('click', function() {
      task.completed = !task.completed;
      saveAndRender();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.className = 'delete';
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      saveAndRender();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  setupDragAndDrop();
  checkAchievement();
}

function saveAndRender() {
  localStorage.setItem('tasks_' + username, JSON.stringify(tasks));
  renderTasks();
}

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem('tasks_' + username)) || [];
  renderTasks();
}

/* --------- Animasi Task --------- */
function animateNewTask() {
  const lastTask = taskList.lastChild;
  if (lastTask) {
    lastTask.classList.add('fade-in');
    setTimeout(() => lastTask.classList.remove('fade-in'), 500);
  }
}

/* --------- Drag and Drop --------- */
function setupDragAndDrop() {
  let dragged;

  taskList.querySelectorAll('li').forEach(item => {
    item.addEventListener('dragstart', function() {
      dragged = this;
      this.classList.add('dragging');
    });

    item.addEventListener('dragend', function() {
      this.classList.remove('dragging');
    });

    item.addEventListener('dragover', function(e) {
      e.preventDefault();
      const bounding = this.getBoundingClientRect();
      const offset = bounding.y + (bounding.height / 2);
      if (e.clientY - offset > 0) {
        this.style['border-bottom'] = 'solid 2px #4CAF50';
        this.style['border-top'] = '';
      } else {
        this.style['border-top'] = 'solid 2px #4CAF50';
        this.style['border-bottom'] = '';
      }
    });

    item.addEventListener('dragleave', function() {
      this.style['border-bottom'] = '';
      this.style['border-top'] = '';
    });

    item.addEventListener('drop', function(e) {
      e.preventDefault();
      if (dragged !== this) {
        const items = [...taskList.children];
        const draggedIndex = items.indexOf(dragged);
        const targetIndex = items.indexOf(this);

        if (draggedIndex < targetIndex) {
          this.after(dragged);
        } else {
          this.before(dragged);
        }

        // Update tasks array
        tasks = [...taskList.children].map(li => {
          const id = parseInt(li.dataset.id);
          return tasks.find(task => task.id === id);
        });

        saveAndRender();
      }
      this.style['border-bottom'] = '';
      this.style['border-top'] = '';
    });
  });
}

/* --------- Sistem Pencapaian --------- */
function checkAchievement() {
  const completedTasks = tasks.filter(task => task.completed).length;
  achievement.innerHTML = '';

  if (completedTasks >= 5) {
    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = '🔥 Produktif Banget! 5+ tugas selesai!';
    achievement.appendChild(badge);
  }
}

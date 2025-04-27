const loginSection = document.getElementById('loginSection');
const mainApp = document.getElementById('mainApp');
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const greeting = document.getElementById('greeting');
const taskInput = document.getElementById('taskInput');
const descInput = document.getElementById('descInput');
const deadlineInput = document.getElementById('deadlineInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const achievementList = document.getElementById('achievementList');
const toggleDarkMode = document.getElementById('toggleDarkMode');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let username = localStorage.getItem('username') || '';

// Login System
loginBtn.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    localStorage.setItem('username', username);
    loadApp();
  }
});

function loadApp() {
  loginSection.classList.add('hidden');
  mainApp.classList.remove('hidden');
  greeting.textContent = `Hai, ${username}!`;
  renderTasks();
}

// Tambah Tugas
addTaskBtn.addEventListener('click', () => {
  const title = taskInput.value.trim();
  const description = descInput.value.trim();
  const deadline = deadlineInput.value;
  if (!title) return alert("Isi judul tugas dulu, bro!");

  const newTask = {
    id: Date.now(),
    title,
    description,
    deadline,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  clearInputs();
  renderTasks();
});

// Simpan dan Render
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearInputs() {
  taskInput.value = '';
  descInput.value = '';
  deadlineInput.value = '';
}

// Render List
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'taskItem';
    li.setAttribute('draggable', true);

    const taskTop = document.createElement('div');
    taskTop.className = 'taskTop';

    const title = document.createElement('span');
    title.className = 'taskTitle';
    title.textContent = task.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.className = 'editBtn';
    deleteBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    };

    taskTop.appendChild(title);
    taskTop.appendChild(deleteBtn);

    const deadline = document.createElement('div');
    deadline.className = 'deadline';
    deadline.textContent = `Deadline: ${task.deadline ? new Date(task.deadline).toLocaleString() : 'Belum diatur'}`;

    const desc = document.createElement('div');
    desc.className = 'descArea';
    desc.innerHTML = `<p>${task.description || 'Deskripsi kosong'}</p>`;

    desc.addEventListener('click', () => {
      const newDesc = prompt('Edit deskripsi:', task.description);
      if (newDesc !== null) {
        task.description = newDesc;
        saveTasks();
        renderTasks();
      }
    });

    li.appendChild(taskTop);
    li.appendChild(deadline);
    li.appendChild(desc);
    taskList.appendChild(li);
  });
  updateAchievements();
}

// Achievement
function updateAchievements() {
  achievementList.innerHTML = '';
  if (tasks.length >= 5) {
    const li = document.createElement('li');
    li.textContent = 'Wah, sudah buat 5 tugas! Hebat!';
    achievementList.appendChild(li);
  }
}

// Dark Mode
toggleDarkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Auto-load kalau user sudah login
if (username) {
  loadApp();
}

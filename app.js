// Ambil elemen
const loginSection = document.getElementById('loginSection');
const mainApp = document.getElementById('mainApp');
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const greeting = document.getElementById('greeting');
const toggleDarkMode = document.getElementById('toggleDarkMode');
const taskInput = document.getElementById('taskInput');
const descInput = document.getElementById('descInput');
const deadlineInput = document.getElementById('deadlineInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const achievementList = document.getElementById('achievementList');
const deadlineSound = document.getElementById('deadlineSound');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let darkMode = false;

// Login
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    loginSection.style.display = 'none';
    mainApp.style.display = 'block';
    greeting.textContent = `Halo, ${username}!`;
  }
});

// Toggle Dark Mode
toggleDarkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  darkMode = !darkMode;
});

// Tambah Tugas
addTaskBtn.addEventListener('click', () => {
  const title = taskInput.value.trim();
  const desc = descInput.value.trim();
  const deadline = deadlineInput.value;

  if (!title || !deadline) return alert('Judul dan deadline wajib diisi!');

  tasks.push({
    id: Date.now(),
    title,
    desc,
    deadline,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskInput.value = '';
  descInput.value = '';
  deadlineInput.value = '';
});

// Simpan ke LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tugas
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'taskItem';
    li.draggable = true;

    li.innerHTML = `
      <div class="taskTop">
        <span>${task.title}</span>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
      <div class="taskDeadline">Deadline: ${new Date(task.deadline).toLocaleString()}</div>
      <div class="taskDesc">${task.desc}</div>
    `;

    taskList.appendChild(li);

    // Alarm jika deadline mendekat (5 menit lagi)
    const timeLeft = new Date(task.deadline) - new Date();
    if (timeLeft < 5 * 60 * 1000 && timeLeft > 0) {
      deadlineSound.play();
    }

    // Drag events
    li.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('id', task.id);
    });
  });
}

// Hapus tugas
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
  checkAchievements();
}

// Cek Pencapaian
function checkAchievements() {
  achievementList.innerHTML = '';

  if (tasks.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Selamat! Semua tugas selesai!';
    achievementList.appendChild(li);
  }
}

// Load saat mulai
renderTasks();

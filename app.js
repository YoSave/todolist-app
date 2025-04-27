const loginSection = document.getElementById('loginSection');
const mainApp = document.getElementById('mainApp');
const taskDetail = document.getElementById('taskDetail');

const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const greeting = document.getElementById('greeting');
const toggleDarkMode = document.getElementById('toggleDarkMode');

const taskInput = document.getElementById('taskInput');
const taskDescInput = document.getElementById('taskDescInput');
const deadlineInput = document.getElementById('deadlineInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

const backBtn = document.getElementById('backBtn');
const taskDetailTitle = document.getElementById('taskDetailTitle');
const taskDetailDesc = document.getElementById('taskDetailDesc');
const taskDetailDeadline = document.getElementById('taskDetailDeadline');
const progressBar = document.getElementById('progressBar');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    loginSection.style.display = 'none';
    mainApp.style.display = 'block';
    greeting.textContent = `Halo, ${username}!`;
  }
});

toggleDarkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

addTaskBtn.addEventListener('click', () => {
  const title = taskInput.value.trim();
  const description = taskDescInput.value.trim();
  const deadline = deadlineInput.value;

  if (!title || !deadline) return alert("Judul dan deadline wajib diisi!");

  const newTask = {
    id: Date.now(),
    title,
    description,
    deadline,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
});

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${task.title}</span>
      <button onclick="openTask(${task.id})">Detail</button>
      <button onclick="deleteTask(${task.id})">Hapus</button>
    `;
    if (isDeadlineSoon(task.deadline)) li.classList.add('deadline-soon');
    taskList.appendChild(li);
  });
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function openTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  mainApp.style.display = 'none';
  taskDetail.style.display = 'block';

  taskDetailTitle.textContent = task.title;
  taskDetailDesc.textContent = task.description;
  taskDetailDeadline.textContent = `Deadline: ${new Date(task.deadline).toLocaleString()}`;
  
  updateProgressBar(task);
  setInterval(() => updateProgressBar(task), 60000);
}

backBtn.addEventListener('click', () => {
  taskDetail.style.display = 'none';
  mainApp.style.display = 'block';
});

function updateProgressBar(task) {
  const now = new Date();
  const created = new Date(task.createdAt);
  const deadline = new Date(task.deadline);

  const total = deadline - created;
  const done = now - created;

  let percentage = (done / total) * 100;
  if (percentage > 100) percentage = 100;
  if (percentage < 0) percentage = 0;

  progressBar.style.width = `${percentage}%`;
}

function isDeadlineSoon(deadline) {
  const now = new Date();
  const dl = new Date(deadline);
  const diff = (dl - now) / (1000 * 60 * 60);
  return diff <= 1; // kurang dari 1 jam
}

// First render
renderTasks();

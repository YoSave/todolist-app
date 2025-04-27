// Ambil semua element penting
const loginSection = document.getElementById('loginSection');
const mainApp = document.getElementById('mainApp');
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const greeting = document.getElementById('greeting');
const toggleDarkMode = document.getElementById('toggleDarkMode');
const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const achievementList = document.getElementById('achievementList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let username = localStorage.getItem('username') || '';

if (username) {
  login(username);
}

loginBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (name !== '') {
    login(name);
    localStorage.setItem('username', name);
  }
});

function login(name) {
  greeting.textContent = `Hai, ${name}!`;
  loginSection.style.display = 'none';
  mainApp.style.display = 'block';
  renderTasks();
  checkAchievements();
}

// Dark Mode Toggle
toggleDarkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Tambah Tugas
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const deadline = deadlineInput.value;
  
  if (taskText === '' || deadline === '') return alert('Isi semua kolom!');

  const newTask = {
    id: Date.now(),
    title: taskText,
    deadline: deadline,
    description: '',
    completed: false
  };
  
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = '';
  deadlineInput.value = '';
});

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.setAttribute('draggable', 'true');
    
    const titleDiv = document.createElement('div');
    titleDiv.textContent = task.title;
    if (task.completed) titleDiv.classList.add('expired');

    const deadlineDiv = document.createElement('div');
    deadlineDiv.className = 'deadline';
    deadlineDiv.textContent = calculateRemainingTime(task.deadline);

    const desc = document.createElement('div');
    desc.className = 'task-desc';
    desc.textContent = task.description || 'Klik untuk menambahkan deskripsi...';
    
    // Klik untuk toggle deskripsi
    titleDiv.addEventListener('click', () => {
      const newDesc = prompt('Isi Deskripsi Tugas:', task.description);
      if (newDesc !== null) {
        task.description = newDesc;
        saveTasks();
        renderTasks();
      }
    });

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'deleteBtn';
    deleteBtn.textContent = 'Hapus';
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    // Drag & Drop
    li.addEventListener('dragstart', () => {
      li.classList.add('dragging');
      li.dataset.draggingId = task.id;
    });

    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
    });

    li.append(titleDiv, deadlineDiv, desc, deleteBtn);
    taskList.appendChild(li);
  });

  enableDragAndDrop();
}

// Fungsi Deadline Waktu Real Time
function calculateRemainingTime(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;

  if (diff <= 0) return 'Deadline lewat!';
  
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return `Sisa waktu: ${hours}j ${minutes}m`;
}

// Simpan Tugas ke LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  checkAchievements();
}

// Cek Achievements
function checkAchievements() {
  achievementList.innerHTML = '';
  
  if (tasks.length >= 5) {
    const li = document.createElement('li');
    li.textContent = '🔥 Tambah 5 tugas!';
    achievementList.appendChild(li);
  }

  const completedTasks = tasks.filter(t => t.completed);
  if (completedTasks.length >= 3) {
    const li = document.createElement('li');
    li.textContent = '✅ Selesaikan 3 tugas!';
    achievementList.appendChild(li);
  }
}

// Drag and Drop Reorder
function enableDragAndDrop() {
  let draggingEl = null;

  taskList.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'LI') {
      draggingEl = e.target;
    }
  });

  taskList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
      taskList.appendChild(draggingEl);
    } else {
      taskList.insertBefore(draggingEl, afterElement);
    }
  });

  taskList.addEventListener('drop', () => {
    updateTasksOrder();
  });
}

// Update Array setelah Drag
function updateTasksOrder() {
  const newOrder = [];
  const listItems = taskList.querySelectorAll('li');
  
  listItems.forEach(li => {
    const id = li.querySelector('.deleteBtn').parentElement.dataset.draggingId;
    const task = tasks.find(t => t.id == id);
    if (task) newOrder.push(task);
  });

  tasks = newOrder;
  saveTasks();
}

// Fungsi Dapatkan Elemen Setelah Drag
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

// Update Deadline Setiap Menit
setInterval(renderTasks, 60000);

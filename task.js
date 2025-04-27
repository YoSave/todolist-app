// Dapatkan ID dari URL
const params = new URLSearchParams(window.location.search);
const taskId = Number(params.get('id'));

const titleEl = document.getElementById('taskTitle');
const descEl = document.getElementById('taskDesc');
const deadlineEl = document.getElementById('taskDeadline');
const progressBar = document.getElementById('progressBar');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTask = tasks.find(t => t.id === taskId);

if (!currentTask) {
  alert("Tugas tidak ditemukan!");
  window.location.href = "index.html";
}

function renderTask() {
  titleEl.textContent = currentTask.title;
  descEl.value = currentTask.description || '';
  deadlineEl.value = currentTask.deadline || '';
  updateProgress();
}

function updateProgress() {
  const now = new Date();
  const created = new Date(currentTask.createdAt);
  const deadline = new Date(currentTask.deadline);

  const total = deadline - created;
  const done = now - created;

  let percentage = (done / total) * 100;
  if (percentage > 100) percentage = 100;
  if (percentage < 0) percentage = 0;

  progressBar.style.width = `${percentage}%`;
}

// Simpan perubahan
function saveTask() {
  currentTask.description = descEl.value;
  currentTask.deadline = deadlineEl.value;

  localStorage.setItem('tasks', JSON.stringify(tasks));
  alert("Perubahan disimpan!");
  window.location.href = "index.html";
}

function goBack() {
  window.location.href = "index.html";
}

// Update progress tiap menit
setInterval(updateProgress, 60000);

// Render pertama
renderTask();

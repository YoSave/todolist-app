document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = parseInt(urlParams.get('id'));
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const editTitle = document.getElementById('editTitle');
  const editDescription = document.getElementById('editDescription');
  const editDeadline = document.getElementById('editDeadline');
  const saveTaskBtn = document.getElementById('saveTaskBtn');
  const deleteTaskBtn = document.getElementById('deleteTaskBtn');
  const alarmAudio = document.getElementById('alarmAudio');

  let currentTask = tasks.find(t => t.id === taskId);
  if (!currentTask) {
    alert('Tugas tidak ditemukan!');
    window.location.href = 'index.html';
    return;
  }

  // Load data ke form
  editTitle.value = currentTask.title;
  editDescription.value = currentTask.description || '';
  editDeadline.value = currentTask.deadline ? new Date(currentTask.deadline).toISOString().slice(0, 16) : '';

  saveTaskBtn.addEventListener('click', () => {
    currentTask.title = editTitle.value.trim();
    currentTask.description = editDescription.value.trim();
    currentTask.deadline = editDeadline.value;

    if (alarmAudio.files.length > 0) {
      const file = alarmAudio.files[0];
      if (file.size <= 200 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = function (e) {
          currentTask.alarmSound = e.target.result;
          saveAndRedirect();
        };
        reader.readAsDataURL(file);
      } else {
        alert('File terlalu besar! Maksimal 200MB.');
      }
    } else {
      saveAndRedirect();
    }
  });

  deleteTaskBtn.addEventListener('click', () => {
    if (confirm('Yakin mau hapus tugas ini?')) {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      window.location.href = 'index.html';
    }
  });

  function saveAndRedirect() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    window.location.href = 'index.html';
  }
});

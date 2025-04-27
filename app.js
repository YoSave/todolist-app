document.addEventListener('DOMContentLoaded', () => {
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskInput = document.getElementById('taskInput');
  const deadlineInput = document.getElementById('deadlineInput');
  const categoryInput = document.getElementById('categoryInput');
  const taskList = document.getElementById('taskList');
  const toggleDarkModeBtn = document.getElementById('toggleDarkMode');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.classList.add('task-item');
      li.innerHTML = `
        <div class="task-content">
          <strong>${task.title}</strong> <br>
          <small>Deadline: ${new Date(task.deadline).toLocaleString()}</small> 
          <div class="progress-bar">
            <div class="progress" style="width:${calculateProgress(task.deadline)}%"></div>
          </div>
        </div>
        <button class="delete-btn" data-id="${task.id}">❌</button>
      `;
      li.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) return;
        window.location.href = `task.html?id=${task.id}`;
      });
      taskList.appendChild(li);
    });
  }

  function calculateProgress(deadline) {
    const totalTime = new Date(deadline) - new Date();
    const progress = Math.max(0, 100 - (totalTime / (1000 * 60 * 60 * 24)) * 100);
    return Math.min(100, progress);
  }

  addTaskBtn.addEventListener('click', () => {
    if (taskInput.value.trim() === '' || !deadlineInput.value) return alert('Lengkapi semua data!');
    
    const newTask = {
      id: Date.now(),
      title: taskInput.value.trim(),
      deadline: deadlineInput.value,
      category: categoryInput.value,
      description: '',
      alarmSet: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    deadlineInput.value = '';
  });

  taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const id = parseInt(e.target.getAttribute('data-id'));
      tasks = tasks.filter(task => task.id !== id);
      saveTasks();
      renderTasks();
    }
  });

  toggleDarkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  renderTasks();
});

const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Ambil data dari localStorage saat halaman dimuat
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

addTaskBtn.addEventListener('click', function() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const newTask = { 
    id: Date.now(), 
    title: taskText, 
    completed: false 
  };

  tasks.push(newTask);
  saveAndRender();
  
  taskInput.value = '';
});

function renderTasks() {
  taskList.innerHTML = ''; // Clear list
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.title;
    li.style.textDecoration = task.completed ? 'line-through' : 'none';

    li.addEventListener('click', function() {
      task.completed = !task.completed;
      saveAndRender();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Biar klik delete nggak ikut toggle selesai
      tasks = tasks.filter(t => t.id !== task.id);
      saveAndRender();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const categoryInput = document.getElementById("categoryInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.innerHTML = `
      <div class="task-content">
        <span class="task-title">${task.title}</span>
        <small class="task-deadline">${new Date(task.deadline).toLocaleString()}</small>
      </div>
      <button class="delete-btn">❌</button>
    `;

    // Klik task untuk buka task.html
    li.querySelector(".task-content").addEventListener("click", () => {
      window.location.href = `task.html?id=${task.id}`;
    });

    // Hapus task
    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    return li;
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach(task => {
      const li = createTaskElement(task);
      taskList.appendChild(li);
    });
  }

  addTaskBtn.addEventListener("click", () => {
    const title = taskInput.value.trim();
    const category = categoryInput.value;
    const deadline = deadlineInput.value;

    if (!title || !deadline) {
      alert("Isi semua kolom!");
      return;
    }

    const task = {
      id: Date.now().toString(),
      title,
      category,
      deadline,
      description: "",
      progress: 0
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = "";
    deadlineInput.value = "";
  });

  renderTasks();
});

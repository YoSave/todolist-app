document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get('id');

  const taskTitle = document.getElementById("taskTitle");
  const taskDescription = document.getElementById("taskDescription");
  const taskProgress = document.getElementById("taskProgress");
  const progressFill = document.getElementById("progressFill");
  const saveBtn = document.getElementById("saveBtn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let task = tasks.find(t => t.id === taskId);

  if (!task) {
    alert("Tugas tidak ditemukan!");
    window.location.href = "index.html";
    return;
  }

  taskTitle.textContent = task.title;
  taskDescription.value = task.description || "";
  taskProgress.value = task.progress || 0;
  progressFill.style.width = task.progress + "%";

  taskProgress.addEventListener("input", () => {
    progressFill.style.width = taskProgress.value + "%";
  });

  saveBtn.addEventListener("click", () => {
    task.description = taskDescription.value;
    task.progress = parseInt(taskProgress.value);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    alert("Perubahan Disimpan!");
    window.location.href = "index.html";
  });
});

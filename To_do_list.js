const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filters button");
const clearCompletedBtn = document.getElementById("clear-completed");
const themeToggleBtn = document.getElementById("theme-toggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks
    .filter(task => {
      if (currentFilter === "completed") return task.completed;
      if (currentFilter === "pending") return !task.completed;
      return true;
    })
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `task${task.completed ? " completed" : ""}`;
      li.setAttribute("draggable", "true");

      li.innerHTML = `
        <span>${task.text}</span>
        <div class="task-buttons">
          <button onclick="toggleComplete(${index})">✔️</button>
          <button onclick="deleteTask(${index})">␡</button>
        </div>
      `;

      // Drag and drop
      li.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", index);
      });
      li.addEventListener("dragover", (e) => e.preventDefault());
      li.addEventListener("drop", (e) => {
        const fromIndex = e.dataTransfer.getData("text/plain");
        const toIndex = index;
        const dragged = tasks.splice(fromIndex, 1)[0];
        tasks.splice(toIndex, 0, dragged);
        saveTasks();
        renderTasks();
      });

      taskList.appendChild(li);
    });
}

// Add task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text !== "") {
    tasks.push({ text, completed: false });
    saveTasks();
    taskInput.value = "";
    renderTasks();
  }
});

// Toggle complete
window.toggleComplete = function (index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
};

// Delete task
window.deleteTask = function (index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
};

// Filter
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// Theme toggle
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Initial render
renderTasks();
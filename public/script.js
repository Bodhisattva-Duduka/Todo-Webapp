const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

function createTask(text) {
    const task = document.createElement("div");
    task.classList.add("task");

    const checkbox = document.createElement("div");
    checkbox.classList.add("checkbox");
    checkbox.innerHTML = '<span class="material-symbols-outlined">check</span>';

    checkbox.addEventListener("click", () => {
        checkbox.classList.toggle("checked");
    });

    const taskTitle = document.createElement("div");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = text;

    // Inline editing
    taskTitle.addEventListener("click", () => {
        taskTitle.setAttribute("contenteditable", "true");
        taskTitle.focus();
    });

    taskTitle.addEventListener("blur", () => {
        taskTitle.removeAttribute("contenteditable");
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
    deleteBtn.addEventListener("click", () => {
        task.remove();
    });

    task.appendChild(checkbox);
    task.appendChild(taskTitle);
    task.appendChild(deleteBtn);
    taskList.appendChild(task);
}

addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text !== "") {
        createTask(text);
        taskInput.value = "";
    }
});

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTaskBtn.click();
    }
});
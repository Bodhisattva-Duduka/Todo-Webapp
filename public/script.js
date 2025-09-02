const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const url = window.location.origin

document.addEventListener('DOMContentLoaded',renderTasks)

function createTask(text, id, completed = false) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.setAttribute("data-id", id);

    const checkbox = document.createElement("div");
    checkbox.classList.add("checkbox");
    checkbox.innerHTML = '<span class="material-symbols-outlined">check</span>';
    if (completed) checkbox.classList.add("checked"); // restore state if true

    checkbox.addEventListener("click", async () => {
        checkbox.classList.toggle("checked");
        const isChecked = checkbox.classList.contains("checked");

        const textOBJ = {
            id: id,
            title: taskTitle.textContent,
            completed: isChecked
        };
        await editingTask(textOBJ); // update backend when toggled
    });

    const taskTitle = document.createElement("div");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = text;

    // Inline editing
    taskTitle.addEventListener("click", () => {
        taskTitle.setAttribute("contenteditable", "true");
        taskTitle.focus();
    });

    taskTitle.addEventListener("blur", async () => {
        taskTitle.removeAttribute("contenteditable");
        const textOBJ = {
            id: id,
            title: taskTitle.textContent,
            completed: checkbox.classList.contains("checked") // keep state
        };
        await editingTask(textOBJ);
    });

    // delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
    deleteBtn.addEventListener("click", async () => {
        const textOBJ = {
            id: id,
            title: taskTitle.textContent,
            completed: checkbox.classList.contains("checked")
        };
        await deletingTask(textOBJ);
        task.remove();
    });

    task.appendChild(checkbox);
    task.appendChild(taskTitle);
    task.appendChild(deleteBtn);
    taskList.appendChild(task);
}

// fetch tasks

async function fetchTasks() {
    try {
        const data = await fetch(`${url}/api/gettasks`)
        const cleanedData = await data.json()
        const arr = cleanedData.data
        return arr
    } catch (error) {
        console.log(error)
    }
}


// render tasks

async function renderTasks() {
    try {
        taskList.innerHTML = "";

        const tasks = await fetchTasks();
        if (!tasks || tasks.length === 0) {
            taskList.innerHTML = `<p style="color: white;" >No tasks found</p>`;
            return;
        }

        tasks.forEach(task => {
            createTask(task.title, task.id, task.completed);
        });
    } catch (error) {
        console.log("Error rendering tasks:", error);
    }
}

addTaskBtn.addEventListener("click", async () => {
    const text = taskInput.value.trim();
    if (text !== "") {
        const taskId = Date.now().toString();
        createTask(text, taskId, false); // default unchecked
        taskInput.value = "";

        const textOBJ = {
            id: taskId,
            title: text,
            completed: false
        };
        await postingTask(textOBJ);
    }
});



// enter key

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTaskBtn.click();
    }
});

// posting task to backend

async function postingTask(taskOBJ) {
    try {
        const info = await fetch(`${url}/api/post/taskname`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskOBJ)
        })

        const data = await info.json()
        console.log(data)
        await renderTasks()
    } catch (error) {
        console.log(error)
    }
}

// deleting task to backend

async function deletingTask(taskOBJ) {
    try {
        const info = await fetch(`${url}/api/delete/taskname`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskOBJ)
        })

        const data = await info.json()
        console.log(data)
        await renderTasks()
    } catch (error) {
        console.log(error)
    }
}

// patching edited task

async function editingTask(taskOBJ) {
    try {
        const info = await fetch(`${url}/api/patch/taskname`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskOBJ)
        })

        const data = await info.json()
        console.log(data)
        await renderTasks()
    } catch (error) {
        console.log(error)
    }
}
// -----------------------------
// INITIAL VARIABLES
// -----------------------------

let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

let dragElement = null;

// -----------------------------
// LOAD SAVED TASKS
// -----------------------------
if (localStorage.getItem("tasks")) {
    tasksData = JSON.parse(localStorage.getItem("tasks"));

    for (const col in tasksData) {
        const column = document.querySelector(`#${col}`);
        tasksData[col].forEach(task => {
            const div = createTaskElement(task.title, task.desc);
            column.appendChild(div);
        });
    }

    updateAllCounts();
}

// -----------------------------
// CREATE TASK DOM ELEMENT
// -----------------------------
function createTaskElement(title, desc) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete-btn">Delete</button>
    `;

    // Drag event
    div.addEventListener("dragstart", () => {
        dragElement = div;
    });

    // Delete event
    div.querySelector(".delete-btn").addEventListener("click", () => {
        div.remove();
        saveTasks();
        updateAllCounts();
    });

    return div;
}

// -----------------------------
// ADD DRAG EVENTS TO COLUMNS
// -----------------------------
function addDragEventsOnColumn(column) {
    column.addEventListener("dragenter", () => {
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", () => {
        column.classList.remove("hover-over");
    });

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", () => {
        column.appendChild(dragElement);
        column.classList.remove("hover-over");
        saveTasks();
        updateAllCounts();
    });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

// -----------------------------
// SAVE TASKS TO LOCALSTORAGE
// -----------------------------
function saveTasks() {
    tasksData = {
        todo: getColumnTasks(todo),
        progress: getColumnTasks(progress),
        done: getColumnTasks(done)
    };

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

function getColumnTasks(column) {
    const tasks = column.querySelectorAll(".task");
    return Array.from(tasks).map(t => ({
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText
    }));
}

// -----------------------------
// UPDATE COUNTERS
// -----------------------------
function updateAllCounts() {
    updateCount(todo);
    updateCount(progress);
    updateCount(done);
}

function updateCount(column) {
    const countEl = column.querySelector(".right");
    if (!countEl) return;
    countEl.innerText = column.querySelectorAll(".task").length;
}

// -----------------------------
// MODAL HANDLING
// -----------------------------

const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

// -----------------------------
// ADD NEW TASK
// -----------------------------
addTaskButton.addEventListener("click", () => {
    const titleInput = document.querySelector("#task-title-input");
    const descInput = document.querySelector("#task-desc-input");

    const taskTitle = titleInput.value.trim();
    const taskDesc = descInput.value.trim();

    if (taskTitle === "") {
        alert("Please enter task title");
        return;
    }

    const div = createTaskElement(taskTitle, taskDesc);

    todo.appendChild(div);

    saveTasks();
    updateAllCounts();

    modal.classList.remove("active");

    titleInput.value = "";
    descInput.value = "";
}); 
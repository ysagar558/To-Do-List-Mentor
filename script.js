const todoSubmit = document.getElementById("todo-submit");
const todoList = document.getElementById("todo-list");
const filterOptions = document.getElementsByName("filter");
!localStorage.getItem("filterBy") ||
    localStorage.getItem("filterBy") === "undefined"
    ? window.localStorage.setItem("filterBy", "all")
    : null;

buildTodoList();
filterTodos();
filterOptions.forEach((item) =>
    item.value === localStorage.getItem("filterBy")
        ? (item.checked = true)
        : (item.checked = false)
);

todoSubmit.addEventListener("click", addTodo);
todoList.addEventListener("click", handleTodoClickEvent);
filterOptions.forEach((option) =>
    option.addEventListener("click", filterTodos)
);

// Build todo list from localStorage
function buildTodoList() {
    todoList.innerHTML = "";
    const currentList =
        JSON.parse(window.localStorage.getItem("localTodoList")) || [];
    currentList.forEach((todo) => buildTodoListItem(todo));
}

// inject a new todo upon input
function buildTodoListItem(todo) {
    let todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
    todoItem.innerHTML = `<p class="todo-content" tabindex="0">${todo.todo}</p><button class="button todo-completed" aria-label="mark complete"><svg class="icon"><use xlink:href="#icon-checked" /></svg></button><button class="button todo-delete" aria-label="mark complete"><svg class="icon"><use xlink:href="#icon-delete" /></svg></button></div>`;
    todo.completed ? todoItem.classList.add("completed") : null;
    todoItem.dataset.id = todo.id;
    todoList.appendChild(todoItem);
}

// add new todo
function addTodo(e) {
    e.preventDefault();
    const todoInput = document.getElementById("todo-input");
    const newTodo = {
        todo: todoInput.value,
        completed: false,
        id: new Date().getTime()
    };
    addTodoToLocalStorage(newTodo);
    buildTodoListItem(newTodo);
    todoInput.value = "";
}

function handleTodoClickEvent(e) {
    e.preventDefault;
    const todo = e.target.parentElement;
    if (e.target.classList.contains("todo-delete")) {
        deleteTodo(todo);
    } else if (e.target.classList.contains("todo-completed")) {
        markTodoComplete(todo);
    }
}

function deleteTodo(todo) {
    todo.classList.add("rotate-fade");
    todo.addEventListener("transitionend", () => {
        removeTodoFromLocalStorage(todo);
        todo.remove();
    });
}

function markTodoComplete(todo) {
    todo.children[0].focus();
    todo.classList.toggle("completed");
    const isComplete = todo.classList.contains("completed") ? true : false;
    const localTodoList = JSON.parse(
        window.localStorage.getItem("localTodoList")
    );
    localTodoList.forEach((item) => {
        if (item.id === parseInt(todo.dataset.id)) item.completed = isComplete;
    });
    console.log(localTodoList);
    window.localStorage.setItem("localTodoList", JSON.stringify(localTodoList));
}

function addTodoToLocalStorage(todo) {
    const currentList =
        JSON.parse(window.localStorage.getItem("localTodoList")) || [];
    const newList = [...currentList, todo];
    window.localStorage.setItem("localTodoList", JSON.stringify(newList));
}

function removeTodoFromLocalStorage(todo) {
    const currentList = JSON.parse(window.localStorage.getItem("localTodoList"));
    const newList = currentList.filter(
        (item) => item.id !== parseInt(todo.dataset.id)
    );
    window.localStorage.setItem("localTodoList", JSON.stringify(newList)) || [];
}

function filterTodos() {
    const value = this.value || window.localStorage.getItem("filterBy");
    const todoListItems = document.querySelectorAll(".todo-item");

    todoListItems.forEach((item) =>
        item.value === value ? (item.checked = true) : (item.checked = false)
    );
    switch (value) {
        case "all":
            todoListItems.forEach((item) => (item.style.display = "grid"));
            break;
        case "completed":
            todoListItems.forEach((item) =>
                !item.classList.contains("completed")
                    ? (item.style.display = "none")
                    : (item.style.display = "grid")
            );
            break;
        case "uncompleted":
            todoListItems.forEach((item) =>
                item.classList.contains("completed")
                    ? (item.style.display = "none")
                    : (item.style.display = "grid")
            );
            break;
        default:
            todoListItems.forEach((item) => (item.style.display = "grid"));
            break;
    }
}

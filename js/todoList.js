
(function (arrOfTasks) {
  const themes = {
    default: {
      "--base-text-color": "#212529",
      "--header-bg": "#007bff",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#007bff",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#0069d9",
      "--default-btn-border-color": "#0069d9",
      "--danger-btn-bg": "#dc3545",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#bd2130",
      "--danger-btn-border-color": "#dc3545",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#80bdff",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
    },
    dark: {
      "--base-text-color": "#212529",
      "--header-bg": "#343a40",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#58616b",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#292d31",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#b52d3a",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#88222c",
      "--danger-btn-border-color": "#88222c",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
    light: {
      "--base-text-color": "#212529",
      "--header-bg": "#fff",
      "--header-text-color": "#212529",
      "--default-btn-bg": "#fff",
      "--default-btn-text-color": "#212529",
      "--default-btn-hover-bg": "#e8e7e7",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#f1b5bb",
      "--danger-btn-text-color": "#212529",
      "--danger-btn-hover-bg": "#ef808a",
      "--danger-btn-border-color": "#e2818a",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
  };

  let tasks = [];
  let objOfTasks ={};

  const listGroup = document.querySelector(".list-group");
  const formTask = document.forms["form-task"];
  const inputTitle = formTask.elements["title"];
  const inputDescription = formTask.elements["description"];
  const themSelect = document.getElementById("themeSelect");
  let lastSelectedTheme = localStorage.getItem("appTheme") || "default";

  myhttp().get("data/todo.json",onGetTasks);
  //Listeners
  setTheme(lastSelectedTheme);
  listGroup.addEventListener("click", onDeleteHandler);
  formTask.addEventListener("submit", onSubmitHandler);
  themSelect.addEventListener("change", onThemSelectHandler);

  function setTheme(name) {
    const selectedThemObj = themes[name];
    Object.entries(selectedThemObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    renderAllTasks(objOfTasks);

  }

  function onGetTasks(err,response) {
    tasks = response;
    objOfTasks = tasks.reduce((acc, task) => {
      acc[task.id] = task;

      return acc;
    }, {});
    renderAllTasks(objOfTasks);
  };

  function onThemSelectHandler(e) {
    const selectedTheme = themSelect.value;
    const isConfirmed = confirm(`Are you shure change them${selectedTheme}`);
    if (!isConfirmed) {
      themSelect.value = lastSelectedTheme;
      return;
    }
    setTheme(selectedTheme);
    lastSelectedTheme = themSelect;
    localStorage.setItem("appTheme", selectedTheme);
  }
  function createNewTask(title, description) {
    const newTask = {
      id: Math.random(),
      title,
      description,
    };
    objOfTasks[newTask.id] = newTask;
    return { ...newTask };
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const descriptionValue = inputDescription.value;
    if (!titleValue || !descriptionValue) {
      alert("Please fill Title and Description");
      return;
    }

    const task = createNewTask(titleValue, descriptionValue);
    const taskItem = taskItemTemplate(task);
    listGroup.insertAdjacentElement("afterbegin", taskItem);

    formTask.reset();
  }



  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirmed = confirm(`Task ${title} will be deleted`);
    if (!isConfirmed) {
      return isConfirmed;
    }
    delete objOfTasks[id];
    return isConfirmed;
  }

  function deleteFromDOM(isDeleted, el) {
    if (!isDeleted) {
      return;
    }
    el.remove();
  }
  function onDeleteHandler({ target }) {
    if (!target.classList.contains("btn")) {
      return;
    }
    let parent = target.closest("[data-task-id]");
    const id = parent.dataset.taskId;
    const isDeleted = deleteTask(id);
    deleteFromDOM(isDeleted, parent);
  }

  function taskItemTemplate({ id, title, description }) {
    const divCard = document.createElement("div");
    divCard.classList.add("card", "mt-2");
    divCard.setAttribute("data-task-id", id);
    const divCardBody = document.createElement("div");
    divCardBody.classList.add("card-body");

    const titleH = document.createElement("h5");
    titleH.classList.add("card-title");
    titleH.textContent = title;

    const text = document.createElement("p");
    text.classList.add("card-text");
    text.textContent = description;

    const btn = document.createElement("a");
    btn.classList.add("btn", "btn-primary");
    btn.textContent = "Delete";
    btn.href = "#";

    divCardBody.appendChild(titleH);
    divCardBody.appendChild(text);
    divCardBody.appendChild(btn);
    divCard.appendChild(divCardBody);

    return divCard;
  }

  function renderAllTasks(taskList) {
    if (!taskList) {
      console.error("Передайте список задач");
      return;
    }
    const fragment = document.createDocumentFragment();
    Object.values(taskList).forEach((task) => {
      const div = taskItemTemplate(task);
      fragment.appendChild(div);
    });
    listGroup.appendChild(fragment);
  }
})();

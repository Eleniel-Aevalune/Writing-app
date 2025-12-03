// ---------- DATA STORAGE ----------
function saveData() {
  localStorage.setItem("writingData", JSON.stringify(data));
}

function loadData() {
  return JSON.parse(localStorage.getItem("writingData")) || {
    projects: {}
  };
}

let data = loadData();
let currentProject = null;
let currentChapter = null;

// ---------- PROJECTS ----------
const projectSelect = document.getElementById("projectSelect");
const newProjectBtn = document.getElementById("newProjectBtn");

function refreshProjects() {
  projectSelect.innerHTML = "";

  for (let name in data.projects) {
    let opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    projectSelect.appendChild(opt);
  }

  if (currentProject) projectSelect.value = currentProject;
}

newProjectBtn.onclick = () => {
  let name = prompt("Project name?");
  if (!name) return;
  data.projects[name] = { chapters: {}, order: [] };
  currentProject = name;
  saveData();
  refreshProjects();
  refreshChapters();
};

// change project
projectSelect.onchange = () => {
  currentProject = projectSelect.value;
  refreshChapters();
};

// ---------- CHAPTERS ----------
const chapterList = document.getElementById("chapterList");
const newChapterBtn = document.getElementById("newChapterBtn");
const editor = document.getElementById("editor");

function refreshChapters() {
  if (!currentProject) return;

  chapterList.innerHTML = "";
  let proj = data.projects[currentProject];

  proj.order.forEach(ch => {
    let li = document.createElement("li");
    li.textContent = ch;
    li.onclick = () => {
      currentChapter = ch;
      editor.value = proj.chapters[ch];
    };
    chapterList.appendChild(li);
  });

  // Load first chapter automatically
  if (proj.order.length > 0) {
    currentChapter = proj.order[0];
    editor.value = proj.chapters[currentChapter];
  }
}

newChapterBtn.onclick = () => {
  if (!currentProject) return alert("Create a project first!");
  let name = prompt("Chapter name?");
  if (!name) return;

  let proj = data.projects[currentProject];
  proj.chapters[name] = "";
  proj.order.push(name);
  saveData();
  refreshChapters();
};

// ---------- AUTOSAVE ----------
editor.oninput = () => {
  if (currentProject && currentChapter) {
    data.projects[currentProject].chapters[currentChapter] = editor.value;
    saveData();
  }
};

// initialize
refreshProjects();
refreshChapters();

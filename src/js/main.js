const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const appView = document.getElementById("appView");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const tasksContainer = document.getElementById("tasksContainer");
const logoutBtn = document.getElementById("logoutBtn");
const userMenu = document.getElementById("userMenu");
const currentUserLabel = document.getElementById("currentUserLabel");

// este es el login
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

// para el registro
const registerUsername = document.getElementById("registerUsername");
const registerAge = document.getElementById("registerAge");
const registerPassword = document.getElementById("registerPassword");
const registerConfirm = document.getElementById("registerConfirm");
const registerBtn = document.getElementById("registerBtn");

const goToRegister = document.getElementById("goToRegister");
const goToLogin = document.getElementById("goToLogin");

let currentUser = null;
let tareas = [];

function mostrarTareas() {
  tasksContainer.innerHTML = "";
  tareas.forEach((tarea, index) => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      ${tarea}
      <button onclick="editarTarea(${index})">Editar</button>
      <button onclick="eliminarTarea(${index})">Eliminar</button>
    `;
    tasksContainer.appendChild(div);
  });
}

function guardarTareas() {
  localStorage.setItem(`tareas_${currentUser}`, JSON.stringify(tareas));
}

function cargarTareas() {
  const datos = localStorage.getItem(`tareas_${currentUser}`);
  tareas = datos ? JSON.parse(datos) : [];
  mostrarTareas();
}

addTaskBtn.addEventListener("click", () => {
  const texto = taskInput.value.trim();
  if (texto === "") return;
  tareas.push(texto);
  guardarTareas();
  mostrarTareas();
  taskInput.value = "";
});

window.eliminarTarea = function (index) {
  tareas.splice(index, 1);
  guardarTareas();
  mostrarTareas();
};

window.editarTarea = function (index) {
  Swal.fire({
    title: "Editar tarea",
    input: "text",
    inputValue: tareas[index],
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      tareas[index] = result.value;
      guardarTareas();
      mostrarTareas();
    }
  });
};

// Con esto reaviso la autenticidad
loginBtn.addEventListener("click", () => {
  const user = loginUsername.value.trim();
  const pass = loginPassword.value;

  if (!user || !pass) {
    Swal.fire("Error", "Completa todos los campos", "error");
    return;
  }

  const users = JSON.parse(localStorage.getItem("usuarios")) || {};

  if (users[user] && users[user].password === pass) {
    iniciarSesion(user);
  } else {
    Swal.fire("Error", "Usuario o contraseña incorrecta", "error");
  }
});

registerBtn.addEventListener("click", () => {
  const user = registerUsername.value.trim();
  const pass = registerPassword.value;
  const confirm = registerConfirm.value;
  const edad = registerAge.value;

  if (!user || !pass || !confirm || !edad) {
    Swal.fire("Error", "Todos los campos son obligatorios", "error");
    return;
  }

  if (pass !== confirm) {
    Swal.fire("Error", "Las contraseñas no coinciden", "error");
    return;
  }

  const users = JSON.parse(localStorage.getItem("usuarios")) || {};

  if (users[user]) {
    Swal.fire("Error", "Este usuario ya existe", "error");
    return;
  }

  users[user] = { password: pass, edad: parseInt(edad) };
  localStorage.setItem("usuarios", JSON.stringify(users));

  Swal.fire("Registrado", "Usuario creado exitosamente", "success").then(() => {
    mostrarVista("login");
  });
});

logoutBtn.addEventListener("click", () => {
  Swal.fire({
    title: "¿Cerrar sesión?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, salir",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("user");
      currentUser = null;
      tareas = [];
      mostrarVista("login");
    }
  });
});

function iniciarSesion(user) {
  currentUser = user;
  localStorage.setItem("user", user);
  currentUserLabel.textContent = `Usuario: ${user}`;
  mostrarVista("app");
  cargarTareas();
}

function mostrarVista(vista) {
  loginView.classList.add("hidden");
  registerView.classList.add("hidden");
  appView.classList.add("hidden");
  userMenu.classList.add("hidden");

  if (vista === "login") {
    loginView.classList.remove("hidden");
  } else if (vista === "register") {
    registerView.classList.remove("hidden");
  } else if (vista === "app") {
    appView.classList.remove("hidden");
    userMenu.classList.remove("hidden");
  }
}

// para navegar entre vistas
goToRegister.addEventListener("click", (e) => {
  e.preventDefault();
  mostrarVista("register");
});

goToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  mostrarVista("login");
});

// Autologin por si hay sesion iniciada previamente
document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) iniciarSesion(savedUser);
  else mostrarVista("login");
});

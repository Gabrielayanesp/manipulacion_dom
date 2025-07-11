
const nombreInput = document.getElementById("nombre");
const edadInput = document.getElementById("edad");
const guardarBtn = document.getElementById("guardarBtn");
const limpiarBtn = document.getElementById("limpiarBtn");
const output = document.getElementById("output");
const contadorDiv = document.getElementById("contador");
const jsonOutput = document.getElementById("jsonOutput");

// datos guardados en Local Storage
guardarBtn.addEventListener("click", () => {
  const nombre = nombreInput.value.trim();
  const edad = edadInput.value.trim();

  if (nombre === "" || edad === "") {
    alert("Por favor completa ambos campos.");
    return;
  }

  const usuario = {
    nombre: nombre,
    edad: parseInt(edad),
  };

  localStorage.setItem("usuario", JSON.stringify(usuario));
  mostrarDatos();
  incrementarContador();
});

// datos para la pagina al recargara
function mostrarDatos() {
  const datos = localStorage.getItem("usuario");

  if (datos) {
    const usuario = JSON.parse(datos);
    output.textContent = `Nombre: ${usuario.nombre}, Edad: ${usuario.edad}`;
  } else {
    output.textContent = "No hay información almacenada.";
  }
}

// contador parn Session Storage
function incrementarContador() {
  let contador = sessionStorage.getItem("interacciones");
  contador = contador ? parseInt(contador) + 1 : 1;
  sessionStorage.setItem("interacciones", contador);
  contadorDiv.textContent = `Interacciones en esta sesión: ${contador}`;
}

// limpiar Local Storage
limpiarBtn.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  mostrarDatos();
  incrementarContador();
});

// datos desde datos.json 
function cargarDatosDesdeJSON() {
  fetch("/database.json")
    .then((res) => res.json())
    .then((data) => {
      console.log("Datos cargados desde database.json:", data);
      jsonOutput.textContent = `Datos JSON externo - Nombre: ${data.nombre}, Edad: ${data.edad}`;
    })
    .catch((error) => {
      console.error("Error cargando database.json:", error);
      jsonOutput.textContent = "No se pudo cargar datos desde JSON externo.";
    });
}

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  mostrarDatos();
  incrementarContador();
  cargarDatosDesdeJSON(); // Llamamos la función extra
});

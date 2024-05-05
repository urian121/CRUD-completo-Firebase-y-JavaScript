import {
  addEmpleado,
  getEmpleadosCollection,
  deleteEmpleadoCollection,
  getEmpleadoCollection,
} from "./firebase.js";

/**
 * Función para obtener todas las colecciones
 */
async function mostrarEmpleadosEnConsola() {
  try {
    const empleadosCollection = getEmpleadosCollection();
    const queryCollection = await empleadosCollection;

    const tablaEmpleados = document.querySelector("#tablaEmpleados tbody");
    tablaEmpleados.innerHTML = "";

    queryCollection.forEach((doc) => {
      const empleado = doc.data();
      const fila = document.createElement("tr");
      fila.id = doc.id; // Asignar el ID del documento al elemento tr
      fila.innerHTML = `
        <td>${empleado.nombre}</td>
        <td>${empleado.edad}</td>
        <td>${empleado.cedula}</td>
        <td>${empleado.sexo}</td>
        <td>${empleado.cargo}</td>
        <td>${empleado.telefono}</td>
        <td>
        <button class="btn btn-danger" onclick="borrar('${doc.id}')">Borrar</button>
        <button class="btn btn-warning" onclick="verDetallesEmpleado('${doc.id}')">Detalles</button>
        <button class="btn btn-warning" onclick="detallesEmpleado('${doc.id}')">D</button>
               
        </td>
      `;
      tablaEmpleados.appendChild(fila);
      console.log("Empleado:", doc.data());
    });
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
  }
}

window.addEventListener("DOMContentLoaded", mostrarEmpleadosEnConsola);

/**
 * Función para agregar un nuevo empleado
 */
window.addNuevoEmpleado = async function (event) {
  event.preventDefault();

  const formulario = document.querySelector("#formularioEmpleado");
  const formData = new FormData(formulario);

  // Convertir FormData a un objeto JSON
  const formDataJSON = {};
  formData.forEach((value, key) => {
    console.log(key, value);
    formDataJSON[key] = value;
  });

  const { nombre, cedula, edad, sexo, telefono, cargo } = formDataJSON;

  try {
    await addEmpleado(nombre, cedula, edad, sexo, telefono, cargo);
    formulario.reset();
    setTimeout(() => {
      $("#agregarEmpleadoModal").css("opacity", "");
      $("#agregarEmpleadoModal").modal("hide");
    }, 500);

    window.mostrarAlerta({ tipoToast: "success", mensaje: "¡Empleado registrado correctamente!" });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Función para mostrar la modal de detalles del empleado
 */
window.detallesEmpleado = async function (idEmpleado) {
  try {
    // Ocultar la modal si está abierta
    const existingModal = document.getElementById("detalleEmpleadoModal");
    if (existingModal) {
      const modal = bootstrap.Modal.getInstance(existingModal);
      if (modal) {
        modal.hide();
      }
      existingModal.remove(); // Eliminar la modal existente
    }

    // Buscar la Modal de Detalles
    const response = await fetch("modales/modalDetalles.php");
    if (!response.ok) {
      throw new Error("Error al cargar la modal de detalles del empleado");
    }
    // response.text() es un método en programación que se utiliza para obtener el contenido de texto de una respuesta HTTP
    const modalHTML = await response.text();

    // Crear un elemento div para almacenar el contenido de la modal
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = modalHTML;

    // Agregar la modal al documento actual
    document.body.appendChild(modalContainer);

    // Mostrar la modal
    const myModal = new bootstrap.Modal(modalContainer.querySelector("#detalleEmpleadoModal"));
    myModal.show();

    await cargarDetalleEmpleado(idEmpleado);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Función para cargar y mostrar los detalles del empleado en la modal
 */
async function cargarDetalleEmpleado(id) {
  try {
    const empleadoDoc = await getEmpleadoCollection(id);
    if (empleadoDoc.exists()) {
      const empleadoData = empleadoDoc.data();
      console.log("Detalles del empleado:", empleadoData);

      const { nombre, edad, cedula, sexo, telefono, cargo } = empleadoData;

      const ulDetalleEmpleado = document.querySelector("#detalleEmpleadoContenido ul");

      ulDetalleEmpleado.innerHTML = ` 
        <li class="list-group-item"><b>Nombre:</b> 
          ${nombre ? nombre : "No disponible"}
        </li>
        <li class="list-group-item"><b>Edad:</b> 
          ${edad ? edad : "No disponible"}
        </li>
        <li class="list-group-item"><b>Cédula:</b> 
          ${cedula ? cedula : "No disponible"}
          </li>
        <li class="list-group-item"><b>Sexo:</b>
         ${sexo ? sexo : "No disponible"}
        </li>
        <li class="list-group-item"><b>Teléfono:</b> ${telefono ? telefono : "No disponible"}</li>
        <li class="list-group-item"><b>Cargo:</b> 
          ${cargo ? cargo : "No disponible"}
        </li>
      `;
    } else {
      console.log("No se encontró ningún empleado con el ID:", id);
    }
  } catch (error) {
    console.error("Error al mostrar detalles del empleado", error);
  }
}

/**
 * Función para borrar un empleado, una colleccion
 */
window.borrar = async function (id) {
  try {
    await deleteEmpleadoCollection(id);
    document.querySelector(`#${id}`).remove();
    mostrarAlerta({ tipoToast: "success", mensaje: "Empleado eliminado correctamente" });
  } catch (error) {
    console.error("Error al borrar el empleado:", error);
    mostrarAlerta({ tipoToast: "error", mensaje: "Error al eliminar el empleado" });
  }
};

/**
 * Función para mostrar alertas
 */

iziToast.settings({
  timeout: 10000,
  resetOnHover: true,
  // icon: '', // icon class
  transitionIn: "flipInX",
  transitionOut: "flipOutX",
  position: "topRight", // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
  onOpening: function () {
    console.log("Alerta abierta!");
  },
  onClosing: function () {
    console.log("Alerta cerrada!");
  },
});
function mostrarAlerta({ tipoToast, mensaje }) {
  if (tipoToast == "success") {
    iziToast.success({
      timeout: 5000,
      icon: tipoToast == "success" ? "bi bi-check-circle-fill" : "bi bi-x-circle-fill",
      title: tipoToast == "success" ? "¡Éxito!" : "¡Error!",
      message: mensaje,
    });
  } else if (tipoToast == "warning") {
    iziToast.success({
      timeout: 5000,
      icon: tipo == "success" ? "bi bi-check-circle-fill" : "bi bi-x-circle-fill",
      title: tipo == "success" ? "¡Éxito!" : "¡Error!",
      message: mensaje,
    });
  }
}

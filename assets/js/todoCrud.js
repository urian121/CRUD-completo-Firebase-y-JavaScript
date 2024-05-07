import {
  addEmpleado,
  getEmpleadosCollection,
  deleteEmpleadoCollection,
  getEmpleadoCollection,
  updateEmpleadoCollection,
} from "./firebase.js";

/**
 * Función para levantar Venta Modal
 */
window.miModal = async function (idModal, idEmpleado = "") {
  try {
    await validarModal(idModal);

    let url = "";
    switch (idModal) {
      case "agregarEmpleadoModal":
        url = "modales/modalAdd.php";
        break;
      case "detalleEmpleadoModal":
        url = "modales/modalDetalles.php";
        break;
      case "editarEmpleadoModal":
        url = "modales/modalEditar.php";
        break;
      case "eliminarEmpleadoModal":
        url = "modales/modalDelete.php";
        break;
      default:
        throw new Error(`El idModal '${idModal}' no es válido`);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error al cargar la modal");
    }

    // response.text() es un método en programación que se utiliza para obtener el contenido de texto de una respuesta HTTP
    const data = await response.text();

    // Crear un elemento div para almacenar el contenido de la modal
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = data;

    // Agregar la modal al documento actual
    document.body.appendChild(modalContainer);

    // Mostrar la modal
    const modalElement = modalContainer.querySelector(`#${idModal}`);
    const myModal = new bootstrap.Modal(modalElement);
    myModal.show();

    if (idModal === "detalleEmpleadoModal") {
      await cargarDetalleEmpleado(idEmpleado);
    } else if (idModal === "editarEmpleadoModal") {
      await getEmpleadoUpdateCollection(idEmpleado);
    } else if (idModal === "eliminarEmpleadoModal") {
      let DeleteBtn = document.querySelector("#confirmDeleteBtn");
      DeleteBtn.addEventListener("click", async () => {
        await eliminarEmpleado(idEmpleado);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

//Función para validar si existe una modal abierta
async function validarModal(idModal) {
  const existingModal = document.getElementById(idModal);
  if (existingModal) {
    const modal = bootstrap.Modal.getInstance(existingModal);
    if (modal) {
      modal.hide();
    }
    existingModal.remove();
  }
}

/**
 * Función para obtener todas las colecciones
 */
async function mostrarEmpleadosEnHTML() {
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
          <a title="Ver detalles del empleado" href="#" onclick="window.miModal('detalleEmpleadoModal','${doc.id}')" class="btn btn-success">
              <i class="bi bi-binoculars"></i>
          </a>
          <a title="Editar datos del empleado" href="#" onclick="window.miModal('editarEmpleadoModal','${doc.id}')" class="btn btn-warning">
              <i class="bi bi-pencil-square"></i>
          </a>
          <a title="Eliminar datos del empleado" href="#" onclick="window.miModal('eliminarEmpleadoModal','${doc.id}')" class="btn btn-danger">
              <i class="bi bi-trash"></i>
          </a>               
        </td>
      `;
      tablaEmpleados.appendChild(fila);
      //console.log("Empleado:", doc.data());
    });
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
  }
}

window.addEventListener("DOMContentLoaded", mostrarEmpleadosEnHTML);

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
    formDataJSON[key] = value;
  });

  const { nombre, cedula, edad, sexo, telefono, cargo } = formDataJSON;

  try {
    await addEmpleado(nombre, cedula, edad, sexo, telefono, cargo);
    formulario.reset();
    setTimeout(() => {
      $("#agregarEmpleadoModal").css("opacity", "");
      $("#agregarEmpleadoModal").modal("hide");
    }, 300);

    window.mostrarAlerta({ tipoToast: "success", mensaje: "¡Empleado registrado correctamente!" });
  } catch (error) {
    console.log(error);
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
 * Buscar empleado a editar
 */
async function getEmpleadoUpdateCollection(id) {
  try {
    const empleadoDoc = await getEmpleadoCollection(id);
    if (empleadoDoc.exists()) {
      const empleadoData = empleadoDoc.data();
      const { nombre, edad, cedula, sexo, telefono, cargo } = empleadoData;
      document.querySelector("#idEmpleado").value = id;
      document.querySelector("#nombre").value = nombre;
      document.querySelector("#cedula").value = cedula;
      document.querySelector("#edad").value = edad;
      document.querySelector(`#sexo_${sexo.toLowerCase()[0]}`).checked = true;
      document.querySelector("#telefono").value = telefono;
      document.querySelector("#cargo").value = cargo;
    } else {
      console.log("No se encontró ningún empleado con el ID:", id);
    }
  } catch (error) {
    console.error("Error al obtener los detalles del empleado:", error);
  }
}

/**
 * Función para actualizar el empleado
 */
window.actualizarEmpleado = async function (event) {
  event.preventDefault();
  const formulario = document.querySelector("#formularioEmpleadoEdit");
  const formData = new FormData(formulario);

  // Convertir FormData a un objeto JSON
  const formDataJSON = {};
  formData.forEach((value, key) => {
    //console.log(key, value);
    formDataJSON[key] = value;
  });

  const { idEmpleado, nombre, cedula, edad, sexo, telefono, cargo } = formDataJSON;
  try {
    await updateEmpleadoCollection(idEmpleado, { nombre, cedula, edad, sexo, telefono, cargo });
    formulario.reset();
    setTimeout(() => {
      $("#editarEmpleadoModal").css("opacity", "");
      $("#editarEmpleadoModal").modal("hide");
    }, 300);

    window.mostrarAlerta({ tipoToast: "success", mensaje: "¡Empleado actualizado correctamente!" });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Función para borrar un empleado, una colleccion
 */
async function eliminarEmpleado(id) {
  try {
    await deleteEmpleadoCollection(id);
    document.querySelector(`#${id}`).remove();
    mostrarAlerta({ tipoToast: "success", mensaje: "Empleado eliminado correctamente" });
  } catch (error) {
    console.error("Error al borrar el empleado:", error);
    mostrarAlerta({ tipoToast: "error", mensaje: "Error al eliminar el empleado" });
  }
}

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
window.mostrarAlerta = function ({ tipoToast, mensaje }) {
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
};

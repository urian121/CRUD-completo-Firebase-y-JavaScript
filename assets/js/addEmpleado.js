/**
 * Modal para agregar un nuevo empleado
 */
async function modalRegistrarEmpleado() {
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

    const response = await fetch("modales/modalAdd.php");

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
    const myModal = new bootstrap.Modal(modalContainer.querySelector("#agregarEmpleadoModal"));
    myModal.show();
  } catch (error) {
    console.error(error);
  }
}

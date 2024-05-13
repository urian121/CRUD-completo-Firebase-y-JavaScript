// Configuración de Firebase
// Importante las versiones para 'firebase-app.js' y para 'firebase-firestore.js' en ambos casos debes ser las mismas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Firebase configuration (replace with your actual project details)
const firebaseConfig = {
  apiKey: "AIzaSyB8NgiosGjaroQcgjmXqTwoTbX8Xs2lG0k",
  authDomain: "crud-firebase-javascript-6c4a6.firebaseapp.com",
  projectId: "crud-firebase-javascript-6c4a6",
  storageBucket: "crud-firebase-javascript-6c4a6.appspot.com",
  messagingSenderId: "185309181999",
  appId: "1:185309181999:web:63cb819043b7d9f0746eda",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Inicializa Cloud Firestore y obtén una referencia al servicio.
export const db = getFirestore(app);

/**
 * ***************************************************************************
 * Acciones para el TODO (Create, Read, Update y Delete)
 * Una colección es equivalente a una tabla en una base de datos relacional.
 * Un Documento es equivalente a un registro en una tabla en una base de datos.
 * ***************************************************************************
 */
const coleccion = "tbl_empleados";

// Esta función agrega un nuevo empleado a una colección en Firestore, con los detalles proporcionados como nombre, cédula, edad, sexo, teléfono y cargo.
export const addEmpleado = (nombre, cedula, edad, sexo, telefono, cargo) =>
  addDoc(collection(db, coleccion), { nombre, cedula, edad, sexo, telefono, cargo });

// Esta función obtiene todos los documentos de una colección de empleados en Firestore y devuelve una promesa que se resuelve con los datos de esos documentos.
export const getEmpleadosCollection = () => getDocs(collection(db, coleccion));

// Esta función obtiene un documento específico de una colección de empleados en Firestore utilizando su ID como referencia y devuelve una promesa que se resuelve con los datos del documento.
export const getEmpleadoCollection = (id) => {
  const docRef = doc(db, coleccion, id);
  return getDoc(docRef);
};

// Esta función actualiza un documento específico en una colección de empleados en Firestore con los nuevos campos proporcionados, utilizando el ID del documento como referencia.
export const updateEmpleadoCollection = (id, newFields) =>
  updateDoc(doc(db, coleccion, id), newFields);

// Esta función elimina un documento específico de una colección de empleados en Firestore utilizando su ID como referencia.
export const deleteEmpleadoCollection = (id) => deleteDoc(doc(db, coleccion, id));

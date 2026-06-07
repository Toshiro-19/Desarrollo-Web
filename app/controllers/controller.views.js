// Aqui van todas las funciones que manejan cada pagina
// Cada funcion recibe la peticion, habla con el backend y muestra la vista

import fetch from "node-fetch";

// URL del backend, lo usamos en todas las peticiones
const API_URL = "http://localhost:3000/api";

// Muestra el formulario de login
// Si ya hay sesion activa, manda directo al menu
export const getLogin = (req, res) => {
  if (req.session.token) {
    return res.redirect("/menu");
  }
  res.render("login", { error: null });
};

// Recibe el usuario y contrasena del formulario
// Si el backend dice que esta bien, guarda el token y va al menu
export const postLogin = async (req, res) => {
  const { usuario, contrasena } = req.body;
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena }),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.render("login", { error: data.message || "Credenciales invalidas" });
    }
    // Guardamos el token en la sesion del servidor, no en el navegador
    req.session.token = data.token;
    res.redirect("/menu");
  } catch (error) {
    console.error("Error en login:", error);
    res.render("login", { error: "Error de conexion con el servidor" });
  }
};

// Muestra la pagina de bienvenida
export const getMenu = (req, res) => {
  res.render("menu");
};

// Cierra la sesion y manda al login
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Error al cerrar sesion:", err);
    res.redirect("/");
  });
};

// Pide todos los usuarios al backend y los muestra en una tabla
export const getUsuarios = async (req, res) => {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${req.session.token}` },
    });
    if (!response.ok) throw new Error("Error al obtener usuarios");
    const usuarios = await response.json();
    res.render("listar", { usuarios });
  } catch (error) {
    console.error("Error:", error);
    // Si algo falla mostramos la tabla vacia
    res.render("listar", { usuarios: [] });
  }
};

// Muestra el formulario vacio para crear un usuario
export const getNuevoUsuario = (req, res) => {
  res.render("crear", { error: null });
};

// Toma los datos del formulario y los manda al backend para guardarlos
export const postCrearUsuario = async (req, res) => {
  const { nombre, email } = req.body;
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.session.token}`,
      },
      body: JSON.stringify({ nombre, email }),
    });
    if (!response.ok) {
      const data = await response.json();
      return res.render("crear", { error: data.message || "Error al crear usuario" });
    }
    // Si todo salio bien, volvemos a la lista
    res.redirect("/usuarios");
  } catch (error) {
    console.error("Error:", error);
    res.render("crear", { error: "Error de conexion con el servidor" });
  }
};

// Busca los datos del usuario por ID y muestra el formulario pre-llenado
export const getEditarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${req.session.token}` },
    });
    if (!response.ok) return res.redirect("/usuarios");
    const usuario = await response.json();
    res.render("editar", { usuario, error: null });
  } catch (error) {
    console.error("Error:", error);
    res.redirect("/usuarios");
  }
};

// Recibe los datos editados y los manda al backend con PUT para actualizar
export const postEditarUsuario = async (req, res) => {
  const { id, nombre, email } = req.body;
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.session.token}`,
      },
      body: JSON.stringify({ nombre, email }),
    });
    if (!response.ok) {
      const data = await response.json();
      return res.render("editar", {
        usuario: { id, nombre, email },
        error: data.message || "Error al actualizar",
      });
    }
    res.redirect("/usuarios");
  } catch (error) {
    console.error("Error:", error);
    res.render("editar", { usuario: { id, nombre, email }, error: "Error de conexion" });
  }
};

// Recibe el ID del usuario y le dice al backend que lo borre
export const postEliminarUsuario = async (req, res) => {
  const { id } = req.body;
  try {
    await fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${req.session.token}` },
    });
    res.redirect("/usuarios");
  } catch (error) {
    console.error("Error:", error);
    res.redirect("/usuarios");
  }
};

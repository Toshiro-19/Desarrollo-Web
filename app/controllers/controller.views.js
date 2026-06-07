import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api";

export const getLogin = (req, res) => {
  if (req.session.token) {
    return res.redirect("/menu");
  }
  res.render("login", { error: null });
};

export const postLogin = async (req, res) => {
  const { usuario, contraseña } = req.body;
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contraseña }),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.render("login", { error: data.message || "Credenciales inválidas" });
    }
    req.session.token = data.token;
    res.redirect("/menu");
  } catch (error) {
    console.error("Error en login:", error);
    res.render("login", { error: "Error de conexión con el servidor" });
  }
};

export const getMenu = (req, res) => {
  res.render("menu");
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Error al cerrar sesión:", err);
    res.redirect("/");
  });
};

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
    res.render("listar", { usuarios: [] });
  }
};

export const getNuevoUsuario = (req, res) => {
  res.render("crear", { error: null });
};

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
    res.redirect("/usuarios");
  } catch (error) {
    console.error("Error:", error);
    res.render("crear", { error: "Error de conexión con el servidor" });
  }
};

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
      return res.render("editar", { usuario: { id, nombre, email }, error: data.message || "Error al actualizar" });
    }
    res.redirect("/usuarios");
  } catch (error) {
    console.error("Error:", error);
    res.render("editar", { usuario: { id, nombre, email }, error: "Error de conexión" });
  }
};

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

// Aquí definimos todas las rutas de la aplicación
// Cada ruta apunta a su función en el controlador

import { Router } from "express";
import {
  getLogin,
  postLogin,
  getMenu,
  logout,
  getUsuarios,
  getNuevoUsuario,
  postCrearUsuario,
  getEditarUsuario,
  postEditarUsuario,
  postEliminarUsuario,
} from "../controllers/controller.views.js";
import { verificarSesion } from "../middleware/auth.middleware.js";

const router = Router();

// Rutas públicas (no necesitan sesión)
router.get("/", getLogin);
router.post("/login", postLogin);
router.get("/logout", logout);

// Rutas protegidas (verificarSesion revisa que haya sesión antes de entrar)
router.get("/menu", verificarSesion, getMenu);

// CRUD de usuarios
router.get("/usuarios", verificarSesion, getUsuarios);
router.get("/usuarios/nuevo", verificarSesion, getNuevoUsuario);
router.post("/usuarios/crear", verificarSesion, postCrearUsuario);
router.get("/usuarios/editar/:id", verificarSesion, getEditarUsuario);
router.post("/usuarios/editar", verificarSesion, postEditarUsuario);
router.post("/usuarios/eliminar", verificarSesion, postEliminarUsuario);

export default router;

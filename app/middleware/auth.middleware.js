// Este middleware revisa si el usuario ya inicio sesion
// Si no tiene sesion activa, lo manda de vuelta al login

export function verificarSesion(req, res, next) {
  if (req.session.token) {
    // Tiene sesion, puede continuar
    next();
  } else {
    // No hay sesion, al login
    res.redirect("/");
  }
}

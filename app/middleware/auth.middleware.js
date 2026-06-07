// Este middleware revisa si el usuario ya inició sesión
// Si no tiene sesión activa, lo manda de vuelta al login

export function verificarSesion(req, res, next) {
  if (req.session.token) {
    // Tiene sesión, puede continuar
    next();
  } else {
    // No hay sesión, al login
    res.redirect("/");
  }
}

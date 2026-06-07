// Archivo principal que arranca el servidor
// Corre en el puerto 4000, el backend debe estar en el 3000

import express from "express";
import session from "express-session";
import rutas from "./app/routes/routes.views.js";

const app = express();
const PORT = 4000;

// Decirle a Express que vamos a usar EJS para las paginas
app.set("view engine", "ejs");
app.set("views", "./views");

// La carpeta public tiene el CSS y otros archivos estaticos
app.use(express.static("public"));

// Para poder leer los datos que llegan de los formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sesiones: aqui guardamos el token del usuario al iniciar sesion
// Dura 2 horas y el navegador nunca ve el token directamente
app.use(
  session({
    secret: "mi_secreto_super_seguro_frontend_ejs",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 60 * 60 * 1000 },
  })
);

// Registrar todas las rutas del proyecto
app.use("/", rutas);

// Arrancar el servidor
app.listen(PORT, () => {
  console.log("Frontend corriendo en http://localhost:" + PORT);
  console.log("Recuerda tener el backend corriendo en el puerto 3000");
});

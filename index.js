const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

//Crear el servidor
const app = express();

//Conecatar a la BD
conectarDB();

//Asignar puerto al servidor
const port = process.env.PORT || 4000;

//Habilitar las peticiones desde el cliente
const opcionesCors = {
    origin: process.env.FRONT_END,
};

app.use(cors(opcionesCors));

//Habilitar leer los valores de un body
app.use(express.json());

//Habilitar carpeta Uploads
app.use(express.static("uploads"));

//Registrar rutas disponibles
app.use("/api/usuarios",require("./routes/usuarios"));
app.use("/api/auth",require("./routes/auth"));
app.use("/api/enlaces",require("./routes/enlaces"));
app.use("/api/archivos",require("./routes/archivos"));

//Arrancar el servidor
app.listen(port, '0.0.0.0', () =>{
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});
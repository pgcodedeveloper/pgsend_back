const express = require("express");
const route = express.Router();
const archivosController = require("../controllers/archivosController");
const auth = require("../middleware/auth");

route.post("/",
    auth,
    archivosController.subirArchivo
);

route.get('/:archivo',
    archivosController.descargar,
    archivosController.eliminarArchivo
);

module.exports = route;
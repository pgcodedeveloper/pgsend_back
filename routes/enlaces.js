const express = require("express");
const route = express.Router();
const enlacesController = require("../controllers/enlacesController");

const { check } = require("express-validator");
const auth = require("../middleware/auth");
const e = require("express");

route.post("/",
    [
        check("nombre","Debes subir un archivo").not().isEmpty(),
        check("nombre_original","Debes subir un archivo").not().isEmpty()
    ],
    auth,
    enlacesController.nuevoEnlace
);

route.get("/",[
    enlacesController.todosEnlaces
]);

route.get("/:url",
    enlacesController.tienePassword,
    enlacesController.obtenerEnlace
);

route.post('/:url',
    enlacesController.verificarPassword,
    enlacesController.obtenerEnlace
);

module.exports = route;
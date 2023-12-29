const express = require("express");
const route = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

route.post("/",
    [
        check("email","Agrega un email válido").isEmail(),
        check("password","El password es obligatorio").not().isEmpty(),
    ],
    authController.authUsuario
);

route.get("/",
    auth,
    authController.userAuth
);

module.exports = route;
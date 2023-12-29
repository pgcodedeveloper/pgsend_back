const Usuarios = require("../models/Usuario");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config({path: "variables.env"});

exports.authUsuario = async (req,res,next) =>{

    //Validar los errores
    const errores = validationResult(req); 

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //Buscar el usuario
    const {email,password} = req.body;
    const user = await Usuarios.findOne({email});

    if(user){
        const passwordOK = await bcrypt.compareSync(password,user.password);
        if(passwordOK){
            //Crear un JWT
            const token = jwt.sign({
                id: user._id,
                nombre: user.nombre,
                email: user.email
            },process.env.SECRETA,{
                expiresIn: "24h"
            });

            res.status(200).json({token});
        }
        else{
            res.status(401).json({msg: "El password es incorrecto"});
            return next();
        }
    }
    else{
        res.status(401).json({msg: "El usuario no existe en el sistema"});
        return next();
    }
}

exports.userAuth = async (req,res,next) =>{
    res.status(200).json({usuario: req.usuario});
}
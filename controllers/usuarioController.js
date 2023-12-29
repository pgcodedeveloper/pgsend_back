const Usuarios = require("../models/Usuario");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.nuevoUsuario = async (req,res) =>{
    
    //Mostar errores de express-validator
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }
    
    //Verificar si el usuario ya esta registrado
    const {email,password} = req.body;

    let user = await Usuarios.findOne({email});

    if(user){
        return res.status(400).json({msg: "El usuario ya esta registrado"});
    }

    //Crear usuario y Hashear password
    const usuario = new Usuarios(req.body);
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password,salt);

    try {
        await usuario.save();
        res.status(200).json({msg: "Usuario creado correctamente"});
    } catch (error) {
        res.status(500).json({msg: "Error en el servidor"});
        console.log(error);
    }
    
    
}
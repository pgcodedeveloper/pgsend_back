const Enlaces = require("../models/Enlace");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const shortid = require("shortid");

exports.nuevoEnlace = async (req,res,next) =>{
    //Ver si hay errores 
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //Almacenar enlace en la BD
    const {nombre_original,nombre} = req.body;
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;
    

    //Si el usuario esta autenticado
    const user = req.usuario;
    if(user){
        const {password, descargas} = req.body;

        if(descargas){
            enlace.descargas = descargas;
        }
        
        if(password){
            enlace.password = await bcrypt.hash(password,10);
        }

        enlace.autor = user.id;
    }

    try {
        await enlace.save();
        return res.status(200).json({msg: `${enlace.url}`});
    } catch (error) {
        res.satus(500).json({msg: "Error en el servidor"});
        console.log(error);
    }

}

exports.todosEnlaces = async (req,res,next) =>{
    try {
        const enlaces = await Enlaces.find({}).select("url");
        res.json({enlaces});
    } catch (error) {
        console.log(error);
    }
}


exports.tienePassword = async (req,res,next) =>{
    const {url} = req.params;

    //Verificar si existe el enlace
    const enlace = await Enlaces.findOne({url});

    if(enlace){ 
        if(enlace.password){
            return res.json({password: true, enlace: enlace.url});
        }
        next();
    }
    else{
        return res.status(404).json({msg: "El enlace no existe"});
    }
}
//Obtener el enalce
exports.obtenerEnlace = async (req,res,next) =>{
    const {url} = req.params;

    //Verificar si existe el enlace
    const enlace = await Enlaces.findOne({url});

    if(enlace){ 
        res.json({archivo: enlace.nombre, password: false});

        next();
    }
    else{
        return res.status(404).json({msg: "El enlace no existe"});
    }
}

exports.verificarPassword = async (req,res,next) => {
    const { password } = req.body;
    const { url } = req.params;

    const enlace = await Enlaces.findOne({url});
    if(bcrypt.compareSync(password,enlace.password)){
        next();
    }
    else{
        return res.status(401).json({msg: "Password Incorrecto"});
    }
}
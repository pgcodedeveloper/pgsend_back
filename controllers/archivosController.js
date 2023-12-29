const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");
const Enlace = require("../models/Enlace");

exports.subirArchivo = async (req,res,next) =>{
    
    const configMulter = {
        limits : { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024},
        storage : fileStorage = multer.diskStorage({
            destination: (req, file, cb) =>{
                cb(null, __dirname+'/../uploads/')
            },
            filename: (req, file, cb) =>{
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        }),
    }
    
    const upload = multer(configMulter).single("archivo");

    upload( req, res, async(error) =>{
        console.log(req.file);

        if(!error){
            res.json({archivo: req.file.filename});
        }
        else{
            console.log(error);
            return next();
        }
    });

}

exports.eliminarArchivo = async (req,res) =>{

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
    } catch (error) {
        console.log(error);
    }
}

exports.descargar = async(req,res, next) =>{

    //Obtiene el enlace
    const enlace = await Enlace.findOne({nombre: req.params.archivo});
    
    const archivo = __dirname + "/../uploads/" + req.params.archivo;
    res.download(archivo);

    //Eliminar el enlace y el archivo si las descargas === 1
    //descarcas iguales a 1 - Borrar la entrada y borrar el archivo
    const {descargas,nombre} = enlace;
    if(descargas === 1){
        //Eliminar el archivo
        req.archivo = nombre;

        //Eliminar la entrada
        await Enlace.deleteOne(enlace._id);
        next();
    }
    else{
        enlace.descargas--;
        await enlace.save();
    }
}
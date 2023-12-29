const jwt = require("jsonwebtoken");
require("dotenv").config({path: "variables.env"});

module.exports = (req,res,next) =>{
    const authHeader = req.get("Authorization");

    if(authHeader){
        //Obtener el token
        const token = authHeader.split(" ")[1];

        //Comprobar el jwt
        
        try {
            const usuario = jwt.verify(token,process.env.SECRETA);
            req.usuario = usuario;
        } catch (error) {
            res.status(401).json({msg: "El JWT no es válido"});
            console.log(error);
        }
    }
    return next();
}
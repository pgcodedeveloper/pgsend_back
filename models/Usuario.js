const mongoose = require("mongoose");

const Shema = mongoose.Schema;
const usuariosShema = new Shema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre : {
        type : String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model("Usuarios",usuariosShema);
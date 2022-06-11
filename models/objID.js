const { Schema, model } = require('mongoose');

const Obj_IdSchema = Schema({
    id: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});


module.exports = model( 'Obj_Id', Obj_IdSchema );

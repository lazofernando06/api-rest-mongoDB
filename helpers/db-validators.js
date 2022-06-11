const Role = require('../models/role');
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

const isRoleValidate = async (role = '') => {
    const existeRol = await Role.findOne({ role });
    if (role != '') {

        if (!existeRol) {
            throw new Error(`El rol ${role} no está registrado en la BD`);
        }
    }
}
const existEmailActive = async (email = '') => {

    // Verificar si el email existe
    const existeEmail = await User.findOne({ email });
    if (existeEmail) {
        throw new Error(`El email: ${email}, ya está registrado`);
    }
}

const existIdEmail = async (id = '') => {
    idMongo = '';
    const [err1, err2] = await Promise.all([
        User.find({ email: id, status: true }),
        User.findById(isValidObjectId(id))
    ]);

    if (err1.length != 0) {
        idMongo = err1[0]._id.valueOf() 
    }

    if (!err2) {
        if (err1.length == 0) {
            return null
        }
    }
    return idMongo;
}

const isValidObjectId = (id) => {

    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return id;
        return null;
    }
    return null;
}



module.exports = {
    isRoleValidate,
    existEmailActive,
    isValidObjectId,
    existIdEmail
}
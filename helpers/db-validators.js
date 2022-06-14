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
        if (existeEmail.status == true) {
            throw new Error(`El email: ${email}, ya está registrado`);
        }
    }
}

const existIdEmail = async (id = '') => {
    let idMongo = null;
    const [err1, err2] = await Promise.all([
        User.findById(isValidObjectId(id)),
        User.find({ email: id, status: true })
        //   User.find({ _id: ObjectId(), status: true }),
    ]);

    if (err2[0]) {
        idMongo = err2[0]._id.valueOf()
    }

    if (err1) {
        err1.status == true ? idMongo = '' : idMongo = null
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
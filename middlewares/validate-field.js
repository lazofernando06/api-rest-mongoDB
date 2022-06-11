const { validationResult } = require("express-validator");
const User = require('../models/user');


const validateField = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json(err);
    }
    next();
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
            throw new Error(`El parametro ingresado: ${id} no se encuentra en la DB.`);
        }
    }
    return idMongo;
}

module.exports = {
    validateField,
}
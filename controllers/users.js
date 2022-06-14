const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { existIdEmail } = require('../helpers/db-validators');


const usersGet = async (req = request, res = response) => {
    let { limit = 5, since = 0 } = req.query;
    const query = { status: true };

    if (!Number(since)) {
        since = 0;
    }
    if (!Number(limit)) {
        limit = 5;
    }

    const [total, user] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(since))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        user
    });
}
const usersGet_x_id = async (req = request, res = response) => {
    const { id } = req.params;

    const idMongo = await existIdEmail(id);
    if (idMongo == null) {
        return res.json({
            msg: `El id / email ingresado: ${id} no es valido`
        });
    }
    const newId = idMongo == '' ? id : idMongo;
    const result = await User.findById(newId);

    if (req.user.role == 'USER_ROLE') {
        if (req.user.email != result.email) {
            return res.json({
                msg: `No estas habilitado para obtener información de otros usuarios.`
            });
        }
    }


    res.json({
        idMongo,
        result
    });
}
const usersPost = async (req, res = response) => {
    const { _id, google, role, ...rest } = req.body;
    const user = new User(rest);

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(rest.password, salt)

    await user.save();

    res.json({
        user
    });
}

const usersPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, role, ...rest } = req.body;


    if (req.user.role != 'USER_ROLE') {
        if (role != '') {
            rest.role = role;
        }
    } else {
        const validatePassword = bcryptjs.compareSync(password, req.user.password);

        if (!validatePassword) {
            return res.json({
                msg: `La contraseña ingresado es incorrecta`
            });
        }
    }



    const idMongo = await existIdEmail(id);

    if (idMongo == null) {
        return res.json({
            msg: `El id / email ingresado: ${id} no es valido`
        });
    }

    const newId = idMongo == '' ? id : idMongo;
    let result = await User.findById(newId);

    if (req.user.role == 'USER_ROLE') {
        if (req.user.email != result.email) {
            return res.json({
                msg: `No estas habilitado para actualizar datos de otros usuarios.`
            });
        }
    }

    await User.findByIdAndUpdate(newId, rest);
    result = await User.findById(newId);

    res.json({
        result
    });

}

const usersPatchPassword = async (req = response, res = response) => {
    const { id } = req.params;
    const idMongo = await existIdEmail(id);
    let pwd = req.body.password;


    if (idMongo == null) {
        return res.json({
            msg: `El id / email ingresado: ${id} no se encuentra en la DB`
        });
    }

    const newId = idMongo == '' ? id : idMongo;
    const result = await User.findById(newId);

    if (req.user.role == 'USER_ROLE') {
        if (req.user.email != result.email) {
            return res.json({
                msg: `No estas habilitado para cambiar otros usuarios.`
            });
        }
    }


    const validatePassword = bcryptjs.compareSync(pwd, result.password);

    if (validatePassword) {
        return res.json({
            msg: 'La contraseña ingresada es la misma'
        });
    }

    const salt = bcryptjs.genSaltSync();
    const pwdSave = bcryptjs.hashSync(pwd, salt)

    const query = { "password": pwdSave }
    await User.findByIdAndUpdate(newId, query);

    res.json({
        result
    });

}

const usersDelete = async (req, res = response) => {
    const { id } = req.params;
    const idMongo = await existIdEmail(id);

    if (idMongo == null) {
        return res.json({
            msg: `El id / email ingresado: ${id} no se encuentra en la DB`
        });
    }
    const newId = idMongo == '' ? id : idMongo;
    const result = await User.findById(newId);

    const query = { status: false }

    if (req.user.role == 'USER_ROLE') {
        if (req.user.email != result.email) {
            return res.json({
                msg: `No estas habilitado para eliminar otros usuarios.`
            });
        }
    }

    await User.findByIdAndUpdate(newId, query);

    res.json({
        result
    });

}

module.exports = {
    usersGet,
    usersGet_x_id,
    usersPost,
    usersPut,
    usersPatchPassword,
    usersDelete,
}
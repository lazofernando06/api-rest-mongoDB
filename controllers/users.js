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
    res.json({
        idMongo,
        result
    });
}
const usersPost = async (req, res = response) => {
    const query = req.body;
    const user = new User(query);

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(query.password, salt)

    await user.save();

    res.json({
        user
    });
}

const usersPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, role, ...rest } = req.body;
    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt)
    }
    if (role != '') {
        rest.role = role;
    }

    const idMongo = await existIdEmail(id);

    if (idMongo == null) {
        return res.json({
            msg: `El id / email ingresado: ${id} no es valido`
        });
    }
    const newId = idMongo == '' ? id : idMongo;
    await User.findByIdAndUpdate(newId, rest);
    const result = await User.findById(newId);

    res.json({
        result
    });

}

const usersPatch = async (req = response, res = response) => {
    const { id } = req.params;
    const idMongo = await existIdEmail(id);
    let pwd = req.body.password;
    console.log(pwd, 'pass del body');
    if (idMongo == null) {
        return res.json({
            msg: `El id / email ingresado: ${id} no se encuentra en la DB`
        });
    }
    const newId = idMongo == '' ? id : idMongo;
    const result = await User.findById(newId);
    console.log(pwd, 'pwd valor');
    console.log(result.password, 'result.password');
    const validatePassword = bcryptjs.compareSync(pwd, result.password);

    console.log(validatePassword, 'comparando');

    if (validatePassword) {
        return res.json({
            msg: 'La contraseña ingresada es la misma'
        });
    }

    const salt = bcryptjs.genSaltSync();
    const pwdSave = bcryptjs.hashSync(pwd, salt)

    console.log(newId, 'newId');
    console.log(pwd, 'pwd');
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
    await User.findByIdAndUpdate(newId, query);

    res.json({
        idMongo,
        result
    });

}

module.exports = {
    usersGet,
    usersGet_x_id,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete,
}
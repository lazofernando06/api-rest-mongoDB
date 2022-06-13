const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    console.log(token);

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETEPRIVATEKEY);
        const user = await User.findById(uid);
        if (!user) {
            return res.json({
                msg: 'Token no valido - u -ne'
            });
        }
        if (!user.status) {
            return res.json({
                msg: 'Token no valido - u -f'
            });
        }
        req.user = user;
        next();

    } catch (err) {
        console.log(err);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }

}



module.exports = {
    validateJWT
}
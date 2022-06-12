const { response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require('../models/user')


const authPost = async (req, res = response) => {

    const { email, password } = req.body;
    const query = { 'email':email, status: true };

    try {
        const user = await User.findOne(query);
        console.log(user,'user');
        console.log(password,'password');
        if (!user) {
            return res.status(400).json({
                msg: ' Email / password no valido - e'
            });
        }
        const validatePassword = bcryptjs.compareSync(password, user.password);

        if (!validatePassword) {
            return res.status(400).json({
                msg: ' Email / password no valido - p'
            });
        }
        res.json({
            msg: 'Logion ok'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }


}

module.exports = {
    authPost
}
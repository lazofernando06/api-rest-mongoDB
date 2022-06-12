const { Router } = require('express');
const { check } = require('express-validator');
const { authPost } = require('../controllers/auth');
const { validateField } = require('../middlewares/validate-field');


const router = Router();


router.post('/login',[
    check('email','El campo es obligatorio').isEmail(),
    check('password','El campo es obligatorio').not().isEmpty(),
    validateField
], authPost);



module.exports = router;
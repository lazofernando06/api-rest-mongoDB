
const { Router } = require('express');
const { check } = require('express-validator');

const { validateField } = require('../middlewares/validate-field');
const { isRoleValidate} = require('../helpers/db-validators');


const { usersGet,
    usersGet_x_id,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch } = require('../controllers/users');

const router = Router();


router.get('/', usersGet);

router.get('/:id', usersGet_x_id);

router.put('/:id', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'Los apellidos son obligatorio').not().isEmpty(),
    validateField
], usersPut);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'Los apellidos son obligatorio').not().isEmpty(),
    check('password', 'Contraseña no valida').isLength({ min: 6 }),
    check('email', 'El email no es valido').isEmail(),
    check('role').custom(isRoleValidate),
    validateField
], usersPost);

router.delete('/:id', usersDelete);

router.patch('/:id', usersPatch);





module.exports = router;
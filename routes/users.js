
const { Router } = require('express');
const { check } = require('express-validator');

const { validateField } = require('../middlewares/validate-field');
const { isRoleValidate } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole, isRole } = require('../middlewares/valiotae-role');


const { usersGet,
    usersGet_x_id,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch, 
    usersPatchPassword} = require('../controllers/users');

const router = Router();


router.get('/', [
  //  validateJWT,
  //  isRole('ADMIN_ROLE', 'DEV_ROLE'),
    validateField
], usersGet);

router.get('/:id', [
    validateJWT,
], usersGet_x_id);

router.put('/:id', [
    validateJWT,
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

router.delete('/:id', [
    validateJWT,
], usersDelete);

router.patch('/:id', [
    validateJWT,
    check('password', 'Contraseña no valida').isLength({ min: 6 }),
    validateField
], usersPatchPassword);





module.exports = router;
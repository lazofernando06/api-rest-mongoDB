const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');


const router = Router();

router.get('/',(res,res)=>{
    console.log('Todo ok');
});


module.exports = router;
const path = require('path');

const express = require('express');

const authController = require('../controllers/authController.js');

const router = express.Router();

// /admin/add-product => GET 
// router.get('/', expController.getappntdata);

// router.get('/:id', expController.getSingleAppntData);

// router.post('/', expController.postAppntdata);

// router.put('/',expController.updAppntdata)

// router.delete('/:id', expController.deleteAppntdata);

router.post('/signup',authController.signup)
router.post('/signin',authController.signin)

// /admin/products => GET




module.exports = router;

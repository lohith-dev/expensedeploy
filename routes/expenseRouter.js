const path = require('path');

const express = require('express');

const expController = require('../controllers/expenseController.js');

const router = express.Router();

const {authenticate} = require('../middleware/auth.js');

// /admin/add-product => GET 



router.get('/download',authenticate, expController.downloadExpense);

router.get('/', authenticate,expController.getappntdata);

router.get('/:id', expController.getSingleAppntData);

router.post('/',authenticate,expController.postAppntdata);

router.put('/',authenticate,expController.updAppntdata)

router.delete('/:id',authenticate, expController.deleteAppntdata);



// /admin/products => GET




module.exports = router;

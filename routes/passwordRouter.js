
const express = require('express');

const passController = require('../controllers/passController.js')

const router = express.Router();



router.post('/forgotpassword',passController.sendEmail);

router.get('/resetpassword/:id',passController.resetPass);

router.post('/reset/:id',passController.reset);







module.exports = router;

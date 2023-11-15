
const express = require('express');

const leadController = require('../controllers/leadboardController.js');

const router = express.Router();

const {authenticate} = require('../middleware/auth.js');

router.get('/', authenticate,leadController.getLeadboardData);










module.exports = router;

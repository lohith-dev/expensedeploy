
const express = require('express');

const purchaseController = require('../controllers/purchaseController.js');

const router = express.Router();

const {authenticate} = require('../middleware/auth.js');

// /admin/add-product => GET 
router.get('/premiummembership', authenticate , purchaseController.purchasePremium);
router.post('/updatetransactionstatus', authenticate , purchaseController.updateTransacitonStatus);
router.post('/updatetransactionFailedStatus', authenticate , purchaseController.transactionFailedStatus);






module.exports = router;

const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const orderController = require('../controllers/order.controller');


const router = express.Router();

// place user order
router.post('/place', authMiddleware, orderController.placeOrder);
router.post('/verify', orderController.verifyOrder);
router.post('/userorders',authMiddleware, orderController.userOrders);
router.get('/list', orderController.listOrders);
router.post('/status', orderController.updateStatus);

module.exports = router;
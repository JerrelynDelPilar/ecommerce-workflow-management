const express = require('express');
const orderController = require('../controllers/orderController');
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// Route to retrieve user's orders
router.get("/my-orders", verify, orderController.getUserOrders);

// Route to retrieve all orders (Admin only)
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

// Route to checkout
router.post("/checkout", verify, orderController.checkoutOrder);

module.exports = router;
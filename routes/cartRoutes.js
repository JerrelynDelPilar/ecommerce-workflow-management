const express = require('express');
const cartController = require('../controllers/cartController');
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();



// Route for changing product quantities in cart
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);

// Route to retrieve user's cart
router.get("/get-cart", verify, cartController.getCart);

// Route to add to cart
router.post("/add-to-cart", verify, cartController.addToCart);

// Route to remove product from cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart);

// Route to remove product from cart
router.put("/clear-cart", verify, cartController.clearCart);

module.exports = router;
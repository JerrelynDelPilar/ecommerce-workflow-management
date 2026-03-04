const Order = require("../models/Order");
const Cart = require('../models/Cart');
const { errorHandler } = require('../auth');
const { clearCart } = require('./cartController'); 

module.exports.getUserOrders = (req, res) => {
	Order.find({ userId: req.user.id })
	.then(orders => {
		if (orders.length === 0) {
			return res.status(404).send({ message: 'No orders found for this user.' });
		}
		return res.status(200).send({ orders });
	})
	.catch(error => errorHandler(error, req, res));  
};

module.exports.getAllOrders = (req, res) => {
	Order.find({})
	.then(orders => {
		if (orders.length === 0) {
			return res.status(404).send({ message: 'No orders found.' });
		}
		return res.status(200).send({ orders });
	})
	.catch(error => errorHandler(error, req, res)); 
};

// Controller function to checkout
module.exports.checkoutOrder = (req, res) => {

	// find the cart of the user
	Cart.findOne({ userId: req.user.id})
	.then(cart => {

		// if no cart document is found
		if(!cart){

			return res.status(404).send({ error: "No Items to Checkout"});

		}else{

			// Check if the cart's cartItem contains an item
			if(cart.cartItems.length > 0){

				// create a new order document
				let newOrder = new Order({
					userId: req.user.id,
					productsOrdered: cart.cartItems,
					totalPrice: cart.totalPrice
				});

				// save new order document
				return newOrder.save()
				.then(result => {

					cart.cartItems = [];
					cart.totalPrice = 0;
					cart.save();

					return res.status(200).send({ 
						message: "Ordered Successfully"
					})

				})
				.catch(error => errorHandler(error, req, res));
			}else{

				return res.status(404).send({ error: "No Items to Checkout" });
			}
		}
	})

	.catch(error => errorHandler(error, req, res));
}

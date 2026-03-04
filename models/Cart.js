const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
	userId: {
		type: String,
		require: [true, 'User ID is required']
	},
	cartItems: [
		{
			productId: {
				type: String,
				require: [true, 'Product ID is required'],
			},
			quantity: {
				type: Number,
				required: [true, 'Quantity is required']
			},
			subtotal: {
				type: Number,
				required: [true, 'Subtotal is required']
			}
		}
	],
	totalPrice: {
		type: Number,
		required: [true, 'Total Price is required']
	},
	orderedOn: {
		type: Date,
		default: Date.now
	}

});


module.exports = mongoose.model('Cart', cartSchema);
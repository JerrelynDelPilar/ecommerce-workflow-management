const Cart = require("../models/Cart");
const { errorHandler } = require('../auth');

module.exports.updateCartQuantity = (req, res) => {
  const { productId, newQuantity } = req.body; 

  if (!productId || !newQuantity || newQuantity <= 0) {
    return res.status(400).send({ message: 'Product ID and valid quantity are required.' });
  }

  return Cart.findOne({ userId: req.user.id })
  .then(cart => {

    if (!cart) {
      res.status(404).send({ message: 'Cart not found for this user.' });
    }
    const cartItem = cart.cartItems.find(item => item.productId === productId);

    if (cartItem) {
      const unitPrice = cartItem.subtotal / cartItem.quantity;
      cartItem.quantity = newQuantity;
      cartItem.subtotal = unitPrice * newQuantity;

      cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

      cart.save();

      res.status(200).send({
        message: 'Item quantity updated successfully.',
        updatedCart: cart,
      });
    } else {
      return res.status(404).send({ message: 'Item not found in cart.' });
    }

  })
  .catch(error => errorHandler(error, req, res)); 
};

// Controller function to get cart
module.exports.getCart = (req, res) => {

	// Find cart by userId
    Cart.findOne({ userId: req.user.id })
    .then(cart => {
        if (!cart) {
            return res.status(404).send({ message: "No cart found" });
        }
        return res.status(200).send({cart: cart});
    })
    .catch(error => errorHandler(error, req, res));
};


// Controller function to add to cart
module.exports.addToCart = (req, res) => {

    Cart.findOne({ userId: req.user.id})
    .then(cart => {
        if (!cart) {
            // Create new cart if not found
            let newCart = new Cart({
                userId: req.user.id,
                cartItems: [{
                    productId: req.body.productId,
                    quantity: req.body.quantity,
                    subtotal: req.body.subtotal
                }],
                totalPrice: req.body.subtotal
            });

            return newCart.save()
                .then(result => res.status(201).send({ 

                	message: "Item added to cart successfully",
                	cart: result
                }))
                .catch(error => errorHandler(error, req, res));
        } else {
            // Check if product already exists in the cart
            let existingProduct = cart.cartItems.find(item => item.productId === req.body.productId);

            if (existingProduct) {
                // Update quantity and subtotal for existing product
                existingProduct.quantity += req.body.quantity;
                existingProduct.subtotal += req.body.subtotal;

                // Update cart total price
                cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

            } else {
                // Add new item to the cart
                cart.cartItems.push({
                    productId: req.body.productId,
                    quantity: req.body.quantity,
                    subtotal: req.body.subtotal
                });

                // update the totalPrice when a new item is added
                cart.totalPrice += req.body.subtotal;
            }

            // Save changes and send the updated cart
            return cart.save()
                .then(updatedCart => res.status(200).send({ 

                	message: "Item added to cart successfully",
                	cart: updatedCart
                }))
                .catch(error => errorHandler(error, req, res));
        }
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.removeFromCart = async (req, res) => {
  let productId = req.params.productId;
console.log(productId)
  Cart.findOne({ userId: req.user.id })
    .then(cart => {
        if (!cart) {
            return res.status(404).send({ message: "No cart found" });
        }

        const productIndex = cart.cartItems.findIndex(item => item.productId === productId);

        if (productIndex >= 0) {
            cart.cartItems.splice(productIndex, 1);
            cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);
            cart.save();

            return res.status(200).send({
              message: 'Item removed from cart successfully.',
              updatedCart: cart,
            });
        } else {
          return res.status(404).send({ message: 'Item not found in cart.' });
        }
    })
    .catch(error => errorHandler(error, req, res));

};

module.exports.clearCart =  (req, res) => {

    Cart.findOne({ userId: req.user.id })
    .then(cart => {
        if (!cart ) {
            return res.status(404).send({ message: "No cart found" });
        } else if(cart.cartItems.length === 0) {
            return res.status(404).send({ message: "Cart is empty" });
        }
        cart.cartItems = [];
        cart.totalPrice = 0;
        cart.save();
        return res.status(200).send({
          message: 'Cart cleared successfully.',
          updatedCart: cart,
        });
    })
    .catch(error => errorHandler(error, req, res));
};


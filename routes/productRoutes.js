const express = require('express');
const productController = require('../controllers/productController');
const { verify, verifyAdmin } = require("../auth");


const router = express.Router();

// Create Product
router.post("/", verify, verifyAdmin, productController.createProduct);

// Retrieve all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// Retrieve all active products
router.get("/active", productController.getAllActive);

// Route for retrieving a specific product
router.get("/:productId", productController.getProduct);

// Route for updating a product(Admin)
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

//Route to archiving a product (Admin)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Route to activating a product (Admin)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Route to search product by name
router.post("/search-by-name", productController.searchByName);

// Route to search product by price range
router.post("/search-by-price", productController.searchProductsByPriceRange);
module.exports = router;
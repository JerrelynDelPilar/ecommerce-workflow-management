const Product = require("../models/Product");
const { errorHandler } = require('../auth');


// Controller to create product
module.exports.createProduct = (req, res) => {

	let newProduct = new Product ({

		name: req.body.name,
		description: req.body.description,
		price: req.body.price
	});


	Product.findOne({ name: req.body.name })
	.then(existingProduct => {

		if(existingProduct){

			return res.status(409).send({ message: 'Product already exists'});
		}else{
			return newProduct.save()

			.then(result => res.status(201).send(result))
            .catch(error => errorHandler(error, req, res))
        }
    })
	.catch(error => errorHandler(error, req, res));

};

// Controller function to get all product
module.exports.getAllProducts = (req, res) => {

	return Product.find({})
	.then(result => {
       
        if(result.length > 0){

            return res.status(200).send(result);
        }
        else{
       
            return res.status(404).send({ message: "No products found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

// Controller function to get all active products
module.exports.getAllActive = (req, res) => {

    Product.find({ isActive : true })
    .then(result => {
   
        if (result.length > 0){
            
            return res.status(200).send(result);
        }
       
        else {
     
            return res.status(404).send({ message: "No active products found" })
        }

    })
    .catch(err => res.status(500).send(err));
};


module.exports.getProduct = (req, res) => {

    Product.findById(req.params.productId)
    .then(product => {
        if(product) {
            return res.status(200).send(product);
        } else {
            return res.status(404).send({ error: 'Product not found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); 
};

module.exports.updateProduct = (req, res)=>{

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(product => {
        if (product) {
            res.status(200).send({ success: true, message: 'Product updated successfully' });
        } else {
            res.status(404).send({ error: 'Product not found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); 
};


module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
        isActive: false
    };

    Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(product => {
            if (product) {
                if (!product.isActive) {
                    return res.status(200).send({ message: 'Product already archived', archivedProduct: product });
                }

                return res.status(200).send({ success: true, message: 'Product archived successfully' });
            } else {

                return res.status(404).send({ error: 'Product not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isActive: true
    }

    Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(product => {
            if (product) {

                if (product.isActive) {
                    return res.status(200).send({ 
                        message: 'Product already active',
                        activateProduct: product
                    });
                }

                return res.status(200).send({
                    success: true,
                    message: 'Product activated successfully'
                });
            } else {

                return res.status(404).send({ error: 'Product not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.searchProductsByPriceRange = (req, res) => {
  const { minPrice, maxPrice } = req.body;

  if (!minPrice || !maxPrice) {
    return res.status(400).send({ message: 'Valid values for both minPrice and maxPrice are required.' });
  }

  if (minPrice < 0 || maxPrice < 0) {
    return res.status(400).send({ message: 'Price values must be non-negative.' });
  }

  Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
    .then(products => {
      if (products.length > 0) {
        return res.status(200).send(products);
      } else {
        return res.status(404).send({ message: 'No products found in this price range.' });
      }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.searchByName = (req, res) => {
    let name = req.body.name
    if (!name) {
        return res.status(400).send({ message: 'Product name is required for search.' });
    }

   Product.find({ name: { $regex: name, $options: 'i' } })
    .then(products => {
      if (products.length > 0) {
        return res.status(200).send(products);
      } else {
        return res.status(404).send({ message: 'No products found with that name.' });
      }
    })
    .catch(error => errorHandler(error, req, res)); 
};

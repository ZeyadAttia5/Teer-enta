const product = require('../models/Product/Product');
const Order = require('../models/Product/Order');
const mongoose = require("mongoose");
const errorHandler = require("../Util/ErrorHandler/errorSender");

exports.createProduct = async (req, res) => {
    try {
        const createdProduct = await product.create(req.body);
        res.status(201).json({message: 'Product created successfully', createdProduct});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await product.find({isActive: true});
        if (products.length === 0) {
            return res.status(200).send({message: 'No products found'});
        }
        res.status(200).json(products);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getArchivedProducts = async (req,res)=>{
    try {
        console.log(req.user);
        const products = await product.find(
            {isActive:false , createdBy:req.user._id});
        if (products.length===0){
            return res.status(200).json({message:"no products found"})
        }
        res.status(200).json(products) ;
    }catch (err){
        errorHandler.SendError(res,err) ;
    }
}

exports.viewAvailableQuantityAndSales = async (req, res) => {
    try {
        // Step 1: Fetch all active products created by the logged-in user
        const products = await product.find({createdBy: req.user._id });
        console.log("Here",products);
        // Step 2: Fetch all orders that are confirmed (i.e., not canceled or pending)
        const orders = await Order.find({ status: { $ne: 'Cancelled' }, isActive: true }).populate('products.product');
        // Step 3: Manually calculate the total quantity sold and total sales for each product
        if(products.length === 0) {
            return res.status(400).json({ message: "You didn't create Any Product Yet" });
        }
        const productSales = products.map(product => {
            let totalQuantitySold = 0;
            let totalSales = 0;

            // Loop through orders and aggregate sales for each product
            orders.forEach(order => {
                order.products.forEach(orderProduct => {
                    if (orderProduct.product._id.toString() === product._id.toString()) {
                        totalQuantitySold += orderProduct.quantity;
                        totalSales += orderProduct.quantity * product.price;
                    }
                });
            });
            // Return the product data with its available quantity, total quantity sold, and total sales
            return {
                _id: product._id,
                name: product.name,
                availableQuantity: product.quantity,  // Available quantity in stock
                totalQuantitySold: totalQuantitySold,  // Quantity sold in total
                totalSales: totalSales  // Total sales amount
            };
        });
        console.log("Here",productSales);
        // Step 4: Return the result
        return res.status(200).json(productSales);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while fetching product sales data." });
    }
};


exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({message: 'Invalid product id'});
        }
        const foundProduct =
            await product.findById(productId)
                .populate('createdBy')
                .populate('ratings.createdBy')
                .populate('reviews.createdBy');
        console.log("Hereeee",foundProduct.createdBy);
        if (!foundProduct) {
            return res.status(404).send({message: 'Product not found'});
        }
        res.status(200).json(foundProduct);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({message: 'Invalid product id'});
        }
        const updatedProduct = await product.findByIdAndUpdate(productId, req.body, {new: true});
        if (!updatedProduct) {
            return res.status(404).send({message: 'Product not found'});
        }
        res.status(200).json({message: 'Product updated successfully', updatedProduct});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.archiveProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({message: 'Invalid product id'});
        }
        const archivedProduct = await product.findByIdAndUpdate(productId, {isActive: false}, {new: true});
        if (!archivedProduct) {
            return res.status(404).send({message: 'Product not found'});
        }
        res.status(200).json({message: 'Product archived successfully', archivedProduct});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.unArchiveProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({message: 'Invalid product id'});
        }
        const unArchivedProduct = await product.findByIdAndUpdate(productId, {isActive: true}, {new: true});
        if (!unArchivedProduct) {
            return res.status(404).send({message: 'Product not found'});
        }
        res.status(200).json({message: 'Product unarchived successfully', unArchivedProduct});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.addRatingToProduct = async (req, res) => {
    try {
        const { id } = req.params; 
        const { rating } = req.body;
        const userId = req.user._id;

        const Product = await product.findById(id);

        if (!Product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // const order = await Order.findOne({
        //     createdBy: userId,
        //     'products.product': id,
        //     status: 'Delivered', 
        //     isActive: true
        // });

        // if (!order) {
        //     return res.status(400).json({ message: "You haven't purchased this product" });
        // }
        const existingRating = Product.ratings.find((r) => r.createdBy.toString() === userId);

        if (existingRating) {
            existingRating.rating = rating;
        } else {
            Product.ratings.push({
                createdBy: userId,
                rating: rating,
            });
        }

        await Product.save();

        res.status(200).json({ message: "Rating added successfully", product });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.getRatingsForProduct = async (req, res) => {
    try {
        const { id } = req.params; 

        const Product = await product.findById(id)
            .populate('ratings.createdBy', 'username');

        if (!Product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ ratings: Product.ratings });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.addReviewToProduct = async (req, res) => {
    try {
        console.log(req.body.review) ;
        const { id } = req.params; 
        const { review } = req.body; 

        const userId = req.user._id;

        // Check if the product exists
        const Product = await product.findById(id);

        if (!Product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user has purchased the product
        // const order = await Order.findOne({
        //     createdBy: userId,
        //     'products.product': id,
        //     status: 'Delivered', 
        //     isActive: true
        // });

        // if (!order) {
        //     return res.status(400).json({ message: "You haven't purchased this product" });
        // }

        Product.reviews.push({
            createdBy: userId,
            review: review,
        });

        await Product.save();

        res.status(200).json({ message: "Review added successfully", product });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.getReviewsForProduct = async (req, res) => {
    try {
        const { id } = req.params; 

        const Product = await product.findById(id)
            .populate('reviews.createdBy', 'username');

        if (!Product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ reviews: Product.reviews });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};



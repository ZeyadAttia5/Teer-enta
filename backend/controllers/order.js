const Order = require('../models/Product/Order')
const Product = require('../models/Product/Product')
const errorHandler = require("../Util/ErrorHandler/errorSender");

exports.createOrder = async (req, res) => {
    try {
        const { products} = req.body;
        let totalPrice = 0 ;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No products in the order' });
        }

        for (const productOrder of products) {
            const product = await Product.findById(productOrder.product);

            if (!product) {
                return res.status(404).json({ message: `Product with ID ${productOrder.product} not found` });
            }
            if (productOrder.quantity > product.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }
            // add price of each product to products array of objects
            productOrder.price = product.price;
            totalPrice += productOrder.quantity * product.price;
        }

        const newOrder = new Order({
            createdBy: req.user._id,  // Assuming req.user._id contains the authenticated user's ID
            products,
            totalPrice,
            status: 'Pending',  // Default status is 'Pending'
            isActive: true,
        });

        await newOrder.save();  // Save the order

        // Step 4: Update the stock of products (reduce the quantity)
        for (const productOrder of products) {
            const product = await Product.findById(productOrder.product);
            product.quantity -= productOrder.quantity;
            await product.save();
        }

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
};

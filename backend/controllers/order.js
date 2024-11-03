const Order = require('../models/Product/Order')
const Tourist = require('../models/Users/Tourist')
const Product = require('../models/Product/Product')
const errorHandler = require("../Util/ErrorHandler/errorSender");

exports.checkOutOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await Tourist.findById(userId).populate('cart.product');

        if (!user || !user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: 'No products in the cart to create an order.' });
        }

        let totalPrice = 0;
        const products = [];

        // Loop through cart items to prepare order details
        for (const cartItem of user.cart) {
            const product = cartItem.product;

            // Check if product exists
            if (!product) {
                return res.status(404).json({ message: 'Product not found in cart.' });
            }

            // Check if sufficient stock is available
            if (cartItem.quantity > product.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }

            // Calculate total price and prepare the product details for the order
            const price = product.price;
            products.push({
                product: product._id,
                quantity: cartItem.quantity,
                price: price
            });
            totalPrice += cartItem.quantity * price;
        }

        const newOrder = new Order({
            createdBy: userId,
            products,
            totalPrice,
            status: 'Pending',
            isActive: true,
        });


        await newOrder.save();

        for (const cartItem of user.cart) {
            const product = cartItem.product;
            product.quantity -= cartItem.quantity;
            await product.save();
        }

        user.cart = [];
        await user.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

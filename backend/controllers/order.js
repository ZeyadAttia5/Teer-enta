const Order = require('../models/Product/Order')
const Tourist = require('../models/Users/Tourist')
const Product = require('../models/Product/Product')
const errorHandler = require("../Util/ErrorHandler/errorSender");
const BrevoService = require("../Util/mailsHandler/brevo/brevoService");
const brevoConfig = require("../Util/mailsHandler/brevo/brevoConfig");
const brevoService = new BrevoService(brevoConfig);
const ProductOutOfStockTemplate = require("../Util/mailsHandler/mailTemplets/6ProductOutOfStockTemplate");
const FlaggedActivityTemplate = require("../Util/mailsHandler/mailTemplets/7FlaggedActivityTemplate");
exports.getOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ createdBy: userId }).populate('products.product');
        if(!orders){
            return res.status(404).json({message: 'No orders found'});
        }
        res.status(200).json(orders);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getCurrentOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({
            createdBy: userId,
            status: 'Pending'
        }).populate('products.product');
        if (!orders) {
            return res.status(404).json({message: 'No orders found'});
        }
        res.status(200).json(orders);
    }catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getOrdersHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({
            createdBy: userId,
            status: { $ne: 'Pending' }
        }).populate('products.product');
        if(!orders){
            return res.status(404).json({message: 'No orders found'});
        }
        res.status(200).json(orders);
    }catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const orderId = req.params.id;
        const order = await Order.findOne({_id: orderId, createdBy: userId}).populate('products.product');
        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }
        res.status(200).json(order);
    }catch (err) {
        errorHandler.SendError(res, err);
    }
}



exports.checkOutOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const deliveryAddress = req.body.deliveryAddress;
        const paymentMethod = req.body.paymentMethod; // wallet, credit card, or cash on delivery

        const user = await Tourist.findById(userId).populate('cart.product');

        if (!user || !user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: 'No products in the cart to create an order.' });
        }

        let totalPrice = 0;
        const products = [];

        for (const cartItem of user.cart) {
            const product = cartItem.product;

            if (!product) {
                return res.status(404).json({ message: 'Product not found in cart.' });
            }

            if (cartItem.quantity > product.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }

            products.push({
                product: product._id,
                quantity: cartItem.quantity,
                price: product.price
            });
            totalPrice += cartItem.quantity * product.price;
        }

        if (paymentMethod === 'wallet') {
            if (user.wallet < totalPrice) {
                return res.status(400).json({ message: 'Insufficient funds in wallet.' });
            }
            console.log(totalPrice);
            user.wallet -= totalPrice; // Deduct from wallet
        } else if (paymentMethod === 'credit_card') {
            // Here you would integrate with Stripe or your payment provider
            // For example, you can create a payment intent with Stripe and handle it accordingly
            // await stripe.paymentIntents.create({ amount: totalPrice, currency: 'usd', ... });
        } else if (paymentMethod === 'cash_on_delivery') {
            // No immediate payment processing required, just proceed with the order
        } else {
            return res.status(400).json({ message: 'Invalid payment method selected.' });
        }

        const newOrder = new Order({
            createdBy: userId,
            products,
            totalPrice,
            deliveryAddress,
            // status: paymentMethod === 'cash_on_delivery' ? 'Pending' : 'Completed',
            status: 'Pending',
            isActive: true,
        });

        await newOrder.save();

        for (const cartItem of user.cart) {
            const product = cartItem.product;
            product.quantity -= cartItem.quantity; // Update stock
            if(product.quantity === 0){
                console.log(product)
                const fProduct = await Product.findById(product._id).populate('createdBy');
                const template = new ProductOutOfStockTemplate(
                    fProduct.name ,
                    fProduct.price,
                    fProduct.description,
                    fProduct.createdBy.username
                );
                await brevoService.send(template,fProduct.createdBy.email);
            }
            await product.save();
        }

        user.cart = [];
        await user.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder, updatedWallet: user.wallet });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.cancelOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const orderId = req.params.id;

        const order = await Order.findOne({_id: orderId, createdBy: userId});
        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        if (order.status === 'Cancelled') {
            return res.status(400).json({message: 'Order already cancelled'});
        }

        const amountToRefund = order.totalPrice;
        order.status = 'Cancelled';
        await order.save();

        const tourist = await Tourist.findById(userId);
        tourist.wallet += amountToRefund;
        await tourist.save();

        res.status(200).json({message: 'Order cancelled successfully', order, walletAmount: tourist.wallet});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};





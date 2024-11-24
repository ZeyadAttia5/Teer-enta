const Tourist = require('../models/Users/Tourist');
const Product = require('../models/Product/Product');
const errorHandler = require("../Util/ErrorHandler/errorSender");

exports.getWishlist = async (req, res) => {
    try {

        const userId = req.user._id;
        const user = await Tourist.findById(userId)
            .populate({
                path: 'wishList',
            })
            .exec();

        if (!user || !user.wishList) {
            return res.status(404).json({ message: 'Wishlist not found.' });
        }
        if(user.wishList.length === 0){
            return res.status(200).json({ message: 'Wishlist is empty.' });
        }
        res.status(200).json({ wishlist: user.wishList });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};

exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await Tourist.findById(userId).populate({
            path: 'cart.product', // Populate the product details for each item in the cart
        }).exec();

        if (!user || !user.cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve cart.' });
    }
};



exports.addToWishlist = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        const user = await Tourist.findById(userId);
        if (user.wishList.includes(productId)) {
            return res.status(400).json({ message: 'Product is already in wishlist.' });
        }
        user.wishList.push(productId);
        await user.save();
        res.status(200).json({ message: 'Product added to wishlist.', wishlist: user.wishList });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};

exports.addToCartFromWishlist = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        const user = await Tourist.findById(userId);
        if (!user.wishList.includes(productId)) {
            return res.status(400).json({ message: 'Product not in wishlist.' });
        }
        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            user.cart.push({ product: productId, quantity: 1 });
        }
        user.wishList = user.wishList.filter(item => item.toString() !== productId);
        await user.save();
        res.status(200).json({ message: 'Product moved from wishlist to cart.', cart: user.cart });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};

exports.addToCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;

        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const user = await Tourist.findById(userId);

        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            user.cart.push({ product: productId, quantity: 1 });
        }

        await user.save();

        res.status(200).json({ message: 'Product added to cart.', cart: user.cart });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};

exports.updateCartProductAmount = async (req, res) => {
    try {
        const productId = req.params.id;
        const { quantity } = req.body;
        const userId = req.user._id;

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1.' });
        }

        const user = await Tourist.findById(userId);
        const cartItem = user.cart.find(item => item.product.toString() === productId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart.' });
        }

        cartItem.quantity = quantity;

        await user.save();

        res.status(200).json({ message: 'Product quantity updated in cart.', cart: user.cart });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};

exports.deleteWishlistProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;

        const user = await Tourist.findById(userId);

        if (!user.wishList.includes(productId)) {
            return res.status(404).json({ message: 'Product not found in wishlist.' });
        }

        user.wishList = user.wishList.filter(item => item.toString() !== productId);

        await user.save();

        res.status(200).json({ message: 'Product removed from wishlist.', wishlist: user.wishList });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};

exports.deleteCartProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;

        const user = await Tourist.findById(userId);
        const cartItem = user.cart.find(item => item.product.toString() === productId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart.' });
        }

        user.cart = user.cart.filter(item => item.product.toString() !== productId);

        await user.save();

        res.status(200).json({ message: 'Product removed from cart.', cart: user.cart });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};




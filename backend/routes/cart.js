const router = require('express').Router();
const cartController = require('../controllers/cart');
const isAuth = require("../middlewares/isAuth");

router.get('/wishlist' ,isAuth , cartController.getWishlist); //MS3 91
router.get('/' ,isAuth , cartController.getCart);
router.post('/add/wishlist/product/:id' ,isAuth , cartController.addToWishlist); //MS3 90
router.post('/add/cartFromWishlist/product/:id' ,isAuth , cartController.addToCartFromWishlist); //MS3 93
router.post('/add/cart/product/:id' ,isAuth , cartController.addToCart); //MS3 94
router.patch('/update/cart/productAmount/:id' ,isAuth , cartController.updateCartProductAmount); //MS3 96
router.delete('/delete/wishlist/product/:id' ,isAuth , cartController.deleteWishlistProduct); //MS3 92
router.delete('/delete/cart/product/:id' ,isAuth , cartController.deleteCartProduct); //MS3 95

module.exports = router;
const router = require('express').Router();
const paymentController = require('../controllers/payment');
const isAuth = require('../middlewares/isAuth');

router.post('/create-payment-intent', isAuth, paymentController.createPaymentIntent);

module.exports = router;
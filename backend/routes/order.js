const router = require('express').Router();
const orderController = require('../controllers/order');
const isAuth = require("../middlewares/isAuth");


// router.get('/' , isAuth , orderController.getOrders);
//
// router.get('/one/:id' , isAuth , orderController.getOrder);

router.post('/create' , isAuth , orderController.createOrder);

// router.put('/update/:id' , isAuth , orderController.updateOrder);
//
// router.patch('/cancel/:id' , isAuth , orderController.cancelOrder);

module.exports = router;
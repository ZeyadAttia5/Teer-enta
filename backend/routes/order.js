const router = require('express').Router();
const orderController = require('../controllers/order');
const isAuth = require("../middlewares/isAuth");


router.get('/' , isAuth , orderController.getOrders);//MS3 104
router.get('/current' , isAuth , orderController.getCurrentOrders);//MS3 104
router.get('/history', isAuth, orderController.getOrdersHistory);//MS3 104
router.get('/one/:id' , isAuth , orderController.getOrder); //MS3 105
router.post('/checkOut' , isAuth , orderController.checkOutOrder); //MS3 97 103 102 109
router.patch('/cancle/:id' , isAuth , orderController.cancelOrder); //MS3 106 107
// router.put('/update/:id' , isAuth , orderController.updateOrder);
// router.patch('/cancel/:id' , isAuth , orderController.cancelOrder);

module.exports = router;
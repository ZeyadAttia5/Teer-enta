const router = require('express').Router();
const productController = require('../controllers/product');

router.post('/create' , productController.createProduct);
router.get('/' , productController.getProducts);
router.get('/:id' , productController.getProduct);
router.put('/edit/:id' , productController.editProduct);

module.exports = router;
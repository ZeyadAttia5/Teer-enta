const router = require('express').Router();
const productController = require('../controllers/product');

router.post('/create' , productController.createProduct);
router.get('/' , productController.getProducts);
router.get('/:id' , productController.getProduct);
router.put('/update/:id' , productController.editProduct);
router.patch('/archive/:id' , productController.archiveProduct);
router.patch('/unArchive/:id' , productController.unArchiveProduct);

module.exports = router;
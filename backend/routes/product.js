const router = require('express').Router();
const productController = require('../controllers/product');
const isAuth = require("../middlewares/isAuth");

router.get('/' , productController.getProducts);
router.get('/one/:id' ,isAuth , productController.getProduct);
router.post('/create' ,isAuth , productController.createProduct);
router.put('/update/:id' ,isAuth , productController.editProduct);
router.patch('/archive/:id' ,isAuth , productController.archiveProduct);
router.patch('/unArchive/:id' ,isAuth , productController.unArchiveProduct);

module.exports = router;
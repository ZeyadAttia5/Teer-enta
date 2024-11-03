const router = require('express').Router();
const productController = require('../controllers/product');
const isAuth = require("../middlewares/isAuth");

router.get('/' , productController.getProducts);
router.get('/one/:id'  , productController.getProduct);
router.get('/salesAndQuantity' , isAuth ,productController.viewAvailableQuantityAndSales);
router.get('/:id/ratings' , productController.getRatingsForProduct);
router.get('/:id/reviews', productController.getReviewsForProduct);

router.post('/create' ,isAuth , productController.createProduct);
router.post('/:id/rate' ,isAuth , productController.addRatingToProduct);
router.post('/:id/review',isAuth ,productController.addReviewToProduct);

router.put('/update/:id' ,isAuth , productController.editProduct);
router.patch('/archive/:id' ,isAuth , productController.archiveProduct);
router.patch('/unArchive/:id' ,isAuth , productController.unArchiveProduct);


module.exports = router;
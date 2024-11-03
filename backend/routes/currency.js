const router = require('express').Router();
const currencyController = require('../controllers/currencies')
const decodeToken = require('../middlewares/decodeToken');

router.get('/' , currencyController.getAllCurrencies) ;
router.get('/getMyCurrency', decodeToken, currencyController.getMyCurrency);
router.post('/add', currencyController.addCurrency);
router.post('/addMultiple',currencyController.addMultipleCurrencies);
router.delete('/',currencyController.deleteAllCurrencies) ;

module.exports = router;
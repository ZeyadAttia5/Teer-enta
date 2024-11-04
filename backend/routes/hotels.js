const router = require('express').Router();
const hotelsController = require('../controllers/hotels');
const isAuth = require('../middlewares/isAuth');

router.get('/getHotelOffers',isAuth, hotelsController.getHotelOffers);
router.post('/bookHotel', isAuth,hotelsController.bookHotel);

module.exports = router;
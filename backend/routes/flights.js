const router = require('express').Router();
const  flightsController = require('../controllers/flights');
const isAuth = require('../middlewares/isAuth');

router.get('/getAirports', isAuth, flightsController.getAirports);
router.get('/getFlightOffers', isAuth, flightsController.getFlightOffers);
router.post('/bookFlight', isAuth, flightsController.bookFlight);

module.exports = router;
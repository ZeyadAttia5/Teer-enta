const router = require('express').Router();
const TouristItenerary = require('../controllers/touristItenerary');

router.get('/', TouristItenerary.getAllItineraries);
router.get('/:id', TouristItenerary.getItineraryById);
router.post('/create', TouristItenerary.createItinerary);
router.put('/update/:id', TouristItenerary.updateItinerary);

module.exports = router ;

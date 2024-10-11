const express = require("express");

const router = express.Router();

const itineraryController = require("../controllers/Itinerary");

const isAuth = require("../middlewares/isAuth");

router.get("/", itineraryController.getItineraries);

router.get("/one/:id", itineraryController.getItinerary);

router.get("/my",isAuth , itineraryController.getMyItineraries);

router.get("/upcoming", itineraryController.getUpcomingItineraries);

router.post("/create", isAuth ,itineraryController.createItinerary);

router.post("/book/:id",isAuth , itineraryController.bookItinerary);
router.post('/activate/:id' , itineraryController.activateItinerary) ;
router.post('/deactivated/:id' , itineraryController.deactivateItinerary) ;
router.put("/update/:id",isAuth , itineraryController.updateItinerary);

router.patch("/flagInappropriate/:id" , isAuth ,itineraryController.flagInappropriate)

router.patch("/cancel/book/:id",isAuth , itineraryController.cancelItineraryBooking);

router.delete("/delete/:id",isAuth , itineraryController.deleteItinerary);


module.exports = router;
const express = require("express");

const router = express.Router();

const itineraryController = require("../controllers/Itinerary");

const isAuth = require("../middlewares/isAuth");

router.get("/", itineraryController.getItineraries);

router.get("/one/:id", itineraryController.getItinerary);

router.get("/my",isAuth , itineraryController.getMyItineraries);

router.get("/upcoming", itineraryController.getUpcomingItineraries);

router.post("/create", isAuth ,itineraryController.createItinerary);

router.put("/update/:id",isAuth , itineraryController.updateItinerary);

router.delete("/delete/:id",isAuth , itineraryController.deleteItinerary);

router.patch("/flagInappropriate/:id" , isAuth ,itineraryController.flagInappropriate)

module.exports = router;
const express = require("express");

const router = express.Router();

const itineraryController = require("../controllers/Itinerary");

router.get("/", itineraryController.getItineraries);

router.get("/:id", itineraryController.getItinerary);

router.get("/my", itineraryController.getMyItineraries);

router.get("/upcoming", itineraryController.getUpcomingItineraries);

router.post("/create", itineraryController.createItinerary);

router.put("/update/:id", itineraryController.updateItinerary);

router.delete("/delete/:id", itineraryController.deleteItinerary);

module.exports = router;
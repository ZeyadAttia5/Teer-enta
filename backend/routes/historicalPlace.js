const express = require("express");

const historicalPlacesController = require("../controllers/historicalPlace");

const router = express.Router();


router.get("/", historicalPlacesController.getHistoricalPlaces);

router.get("/:id", historicalPlacesController.getHistoricalPlace);

router.get("/my", historicalPlacesController.getMyHistoricalPlaces);

router.get("/upcoming", historicalPlacesController.getUpcomingHistoricalPlaces);

router.post("/create", historicalPlacesController.createHistoricalPlace);

router.put("/update/:id", historicalPlacesController.updateHistoricalPlace);

router.delete("/delete/:id", historicalPlacesController.deleteHistoricalPlace);

module.exports = router;
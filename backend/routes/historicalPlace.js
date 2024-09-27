const express = require("express");

const historicalPlacesController = require("../controllers/historicalPlace");

const router = express.Router();


router.get("/", historicalPlacesController.getHistoricalPlaces);

router.post("/create", historicalPlacesController.createHistoricalPlace);

router.put("/update/:id", historicalPlacesController.updateHistoricalPlace);

router.delete("/delete/:id", historicalPlacesController.deleteHistoricalPlace);

module.exports = router;
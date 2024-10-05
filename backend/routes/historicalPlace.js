const express = require("express");

const historicalPlacesController = require("../controllers/historicalPlace");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();


router.get("/", historicalPlacesController.getHistoricalPlaces);

router.get("/one/:id", historicalPlacesController.getHistoricalPlace);

router.get("/my",isAuth , historicalPlacesController.getMyHistoricalPlaces);

router.get("/upcoming", historicalPlacesController.getUpcomingHistoricalPlaces);

router.post("/create", isAuth ,historicalPlacesController.createHistoricalPlace);

router.put("/update/:id",isAuth , historicalPlacesController.updateHistoricalPlace);

router.delete("/delete/:id",isAuth , historicalPlacesController.deleteHistoricalPlace);

module.exports = router;
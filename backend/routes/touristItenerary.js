const router = require("express").Router();
const TouristItenerary = require("../controllers/touristItenerary");
const isAuth = require("../middlewares/isAuth");

router.get("/", TouristItenerary.getAllItineraries);
router.get("/:id", TouristItenerary.getItineraryById);
router.post("/create", isAuth, TouristItenerary.createItinerary);
router.put("/update/:id", isAuth, TouristItenerary.updateItinerary);
router.delete("/delete/:id", isAuth, TouristItenerary.deleteItenerary);

module.exports = router;

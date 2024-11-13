const express = require("express");
const isAuth = require("../middlewares/isAuth");
const statisticsController = require("../controllers/statistics");
const router = express.Router();
//TODO: Add isAuth middleware

router.get('/totalUsers' ,statisticsController.getTotalUsers);
router.get('/newUsersPerMonth',statisticsController.getNewUsersPerMonth);
router.get('/itineraryTouristCount/:id', statisticsController.getItineraryTouristCount );
router.get('/activityTouristCount/:id', statisticsController.getActivityTouristCount);
module.exports = router;
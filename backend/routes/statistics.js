const express = require("express");
const isAuth = require("../middlewares/isAuth");
const statisticsController = require("../controllers/statistics");
const router = express.Router();


router.get('/totalUsers' ,isAuth,statisticsController.getTotalUsers);
router.get('/newUsersPerMonth',isAuth,statisticsController.getNewUsersPerMonth);
router.get('/itineraryTouristCount/:id',isAuth, statisticsController.getItineraryTouristCount );
router.get('/activityTouristCount/:id',isAuth, statisticsController.getActivityTouristCount);
module.exports = router;
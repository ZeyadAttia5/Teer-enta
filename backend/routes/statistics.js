const express = require("express");
const isAuth = require("../middlewares/isAuth");
const statisticsController = require("../controllers/statistics");
const router = express.Router();
//TODO: Add isAuth middleware

router.get('/totalUsers' ,statisticsController.getTotalUsers);
router.get('/newUsersPerMonth',statisticsController.getNewUsersPerMonth);
router.get('/report/adminRevenue',isAuth, statisticsController.getAdminRevenueReport);
router.get('/report/itinerary',isAuth, statisticsController.getItineraryReport);   // tourguide 
router.get('/report/activity',isAuth, statisticsController.getActivityReport);  // adervisters
router.get('/report/transportation',isAuth, statisticsController.getTransportationReport);  // advertiser
router.get('/report/order',isAuth, statisticsController.getProductReport); // admin , seller

module.exports = router;
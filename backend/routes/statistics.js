const express = require("express");
const isAuth = require("../middlewares/isAuth");
const statisticsController = require("../controllers/statistics");
const router = express.Router();
//TODO: Add isAuth middleware

router.get('/totalUsers' ,statisticsController.getTotalUsers);
router.get('/newUsersPerMonth',statisticsController.getNewUsersPerMonth);
router.get('/report/adminRevenue',isAuth, statisticsController.getAdminRevenueReport);
router.get('/report/itinerary',isAuth, statisticsController.getItineraryReport);
router.get('/report/activity',isAuth, statisticsController.getActivityReport);
router.get('/report/transportation',isAuth, statisticsController.getTransportationReport);
router.get('/report/order',isAuth, statisticsController.getProductReport);

module.exports = router;
const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notifications");

const isAuth = require("../middlewares/isAuth");

router.post("/create", isAuth, notificationController.createNotificationRequest);



module.exports = router;
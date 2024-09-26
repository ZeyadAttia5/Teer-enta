const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activity");

router.get("/", activityController.getActivities);

router.post("/add-activity", activityController.createActivity);

router.put("/edit-activity/:activityId", activityController.updateActivity);

router.delete("/delete-activity/:activityId", activityController.deleteActivity);




module.exports = router;
const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activity");

router.get("/", activityController.getActivities);

router.post("/add-activity", activityController.postAddActivity);

router.put("/edit-activity/:activityId", activityController.putEditActivity);

router.delete("/delete-activity/:activityId", activityController.deleteActivity);




module.exports = router;
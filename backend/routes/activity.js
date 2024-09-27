const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activity");

router.get("/", activityController.getActivities);

router.post("/create", activityController.createActivity);

router.put("/update/:id", activityController.updateActivity);

router.delete("/delete/:id", activityController.deleteActivity);


module.exports = router;
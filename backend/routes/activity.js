const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activity");
const itineraryController = require("../controllers/Itinerary");

router.get("/", activityController.getActivities);


router.get("/my", activityController.getMyActivities);

router.get("/upcoming", activityController.getUpcomingActivities);

router.post("/create", activityController.createActivity);

router.put("/update/:id", activityController.updateActivity);

router.delete("/delete/:id", activityController.deleteActivity);


router.get("/:id", activityController.getActivity);

router.patch("/flagInappropriate/:id" , activityController.flagInappropriate)


module.exports = router;
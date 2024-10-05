const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activity");
const itineraryController = require("../controllers/Itinerary");

const isAuth = require("../middlewares/isAuth");

router.get("/", activityController.getActivities);


router.get("/my",isAuth , activityController.getMyActivities);

router.get("/upcoming", activityController.getUpcomingActivities);

router.post("/create",isAuth , activityController.createActivity);

router.put("/update/:id" , isAuth  ,activityController.updateActivity);

router.delete("/delete/:id",isAuth , activityController.deleteActivity);

router.get("/:id", activityController.getActivity);

router.patch("/flagInappropriate/:id" ,isAuth , activityController.flagInappropriate)


module.exports = router;
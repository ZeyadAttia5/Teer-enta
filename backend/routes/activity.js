const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activity");
const itineraryController = require("../controllers/Itinerary");

const isAuth = require("../middlewares/isAuth");

router.get("/", activityController.getActivities);
router.get("/my",isAuth , activityController.getMyActivities);
router.get("/one/:id", activityController.getActivity);
router.get("/upcoming", activityController.getUpcomingActivities);
router.post("/create",isAuth , activityController.createActivity);
router.post("/flagInappropriate/:id" ,isAuth , activityController.flagInappropriate);
router.post('/activate/:id' , activityController.activateActivity) ;
router.post('/deactivate/:id' , activityController.deactivateActivity) ;
router.put("/update/:id"  ,activityController.updateActivity);
router.delete("/delete/:id",isAuth , activityController.deleteActivity);




module.exports = router;
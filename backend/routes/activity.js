const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activity");


const isAuth = require("../middlewares/isAuth");

router.get("/", activityController.getActivities);

router.get("/my",isAuth , activityController.getMyActivities);

router.get("/upcoming", activityController.getUpcomingActivities);

router.get("/one/:id", activityController.getActivity);

router.post("/create",isAuth , activityController.createActivity);

router.post("/book/:id",isAuth , activityController.bookActivity);

router.put("/update/:id"  ,activityController.updateActivity);

router.patch("/flagInappropriate/:id" ,isAuth , activityController.flagInappropriate)

router.patch("/cancel/book/:id",isAuth , activityController.cancelActivityBooking);

router.delete("/delete/:id",isAuth , activityController.deleteActivity);


module.exports = router;
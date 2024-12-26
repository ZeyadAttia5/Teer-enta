const express = require("express");

const   router = express.Router();

const activityController = require("../controllers/activity");
const itineraryController = require("../controllers/Itinerary");

const isAuth = require("../middlewares/isAuth");

router.get("/", activityController.getActivities);
router.get("/my", isAuth, activityController.getMyActivities);
router.get("/upcoming", activityController.getUpcomingActivities);
router.get("/upcoming/paid", isAuth, activityController.getUpcomingPaidActivities);  //MS3 64
router.get("/flagged",isAuth, activityController.getFlaggedActivities);
router.get("/one/:id", activityController.getActivity);
router.get("/:id/ratings", activityController.getRatingsForActivity);
router.get("/:id/comments", activityController.getCommentsForActivity);
router.get("/booked", isAuth, activityController.getBookedActivities);
router.get("/pendingBookings", isAuth, activityController.pendingBookings);
router.get("/completedBookings", isAuth, activityController.completedBookings);
router.get("/unactive", isAuth,activityController.getUnactiveActivities);
router.post("/create", isAuth, activityController.createActivity);
router.post('/activate/:id',isAuth, activityController.activateActivity);
router.post('/deactivate/:id',isAuth, activityController.deactivateActivity);
router.post("/book/:id", isAuth, activityController.bookActivity);
router.post("/:id/rate", isAuth, activityController.addRatingToActivity);
router.post('/:id/comment', isAuth, activityController.addCommentToActivity);
router.post('/makeAllActivitesAppropriate', activityController.makeAllActivitiesAppropriate);
router.put("/update/:id",isAuth, activityController.updateActivity);
router.patch("/flagInappropriate/:id", isAuth, activityController.flagInappropriate);
router.patch("/UnFlagInappropriate/:id", isAuth, activityController.UnFlagInappropriate);
router.patch("/cancel/book/:id", isAuth, activityController.cancelActivityBooking);
router.delete("/delete/:id", isAuth, activityController.deleteActivity);


module.exports = router;
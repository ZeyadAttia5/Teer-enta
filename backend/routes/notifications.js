const express = require("express");

const router = express.Router();


const isAuth = require("../middlewares/isAuth");
const notificationsController = require("../controllers/notifications");

router.get("/my", isAuth, notificationsController.getAllMyNotifications);
router.get("/myRequest/:activityId", isAuth, notificationsController.getMyRequest);
router.get("/allMyRequests", isAuth, notificationsController.getAllMyRequests);
router.post("/createRequest", isAuth, notificationsController.createNotificationRequest);
router.post('/send',notificationsController.sendNotification);
router.post('/saveFCMToken', isAuth, notificationsController.SaveFCMToken);
router.post('/markAllAsRead',isAuth,notificationsController.markAllAsRead);
router.post('/markAsRead/:id',isAuth,notificationsController.markAsRead);
router.patch('/updateRequestStatus', isAuth, notificationsController.updatedNotificationRequestStatus);
router.delete('/delete/:id', isAuth, notificationsController.deleteNotification);
router.delete('/my',isAuth,notificationsController.deleteAllMyNotifications);



module.exports = router;
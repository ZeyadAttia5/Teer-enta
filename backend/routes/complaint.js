const router = require('express').Router();
const isAuth = require("../middlewares/isAuth");
const complaintController = require("../controllers/complaint");

router.get('/',isAuth, complaintController.getComplaints);
router.get('/my',isAuth, complaintController.getMyComplaints);
router.get('/one/:id',isAuth, complaintController.getComplaint);
router.post('/create',isAuth, complaintController.createComplaint);
router.put('/update/:id',isAuth, complaintController.updateComplaint);


module.exports = router;
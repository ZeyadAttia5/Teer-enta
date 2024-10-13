const router = require('express').Router();
const isAuth = require("../middlewares/isAuth");
const complaintController = require("../controllers/complaint");


router.post('/fileComplaint',isAuth, complaintController.fileComplaint);

module.exports = router;
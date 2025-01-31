const express = require("express");
const transportationController = require("../controllers/transportation");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get("/", transportationController.getAllTransportations);
router.get("/:id", transportationController.getTransportation);
router.get('/booked/all' , isAuth , transportationController.getBookedTransportations);
router.post("/create",isAuth , transportationController.createTransportation);
router.post("/book/:id",isAuth , transportationController.bookTransportation);





module.exports = router;
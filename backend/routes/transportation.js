const express = require("express");
const transportationController = require("../controllers/transportation");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get("/", transportationController.getAllTransportations);
router.get("/:id", transportationController.getTransportation);
router.post("/create",isAuth , transportationController.createTransportation);
router.post("/book/:id",isAuth , transportationController.bookTransportation);
router.get('/booked' , isAuth , transportationController.getBookedTransportations);





module.exports = router;
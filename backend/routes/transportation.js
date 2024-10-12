const express = require("express");
const transportationController = require("../controllers/transportation");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.post("/book/:id",isAuth , transportationController.bookTransportation);





module.exports = router;
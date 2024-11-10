const express = require("express");
const promoCodeController = require("../controllers/promoCode");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.post("/create", isAuth, promoCodeController.createPromoCode);

module.exports = router;
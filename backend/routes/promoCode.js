const express = require("express");
const promoCodeController = require("../controllers/promoCode");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get("/", isAuth, promoCodeController.getAllPromoCodes);
router.post("/create", isAuth, promoCodeController.createPromoCode);
router.post("/apply", isAuth, promoCodeController.applyPromoCode);

module.exports = router;
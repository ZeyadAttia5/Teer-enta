const express = require("express");

const router = express.Router();

const tourGuideController = require("../controllers/tourGuide");
const isAuth = require("../middlewares/isAuth");


router.get("/:id/ratings",tourGuideController.getRatingsForTourGuide);
router.get("/:id/comments",tourGuideController.getCommentsForTourGuide);
router.post("/:id/rate", isAuth ,tourGuideController.rateTourGuide );
router.post("/:id/comment", isAuth ,tourGuideController.commentOnTourGuide);



module.exports = router;
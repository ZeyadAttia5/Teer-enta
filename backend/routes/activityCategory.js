const express = require("express");
const activityCategoryController = require("../controllers/activityCategory");
const isAuth = require("../middlewares/isAuth");
const router = express.Router();

router.get("/", activityCategoryController.getActivityCategories);

router.post("/create",isAuth , activityCategoryController.createActivityCategory);

router.put("/update/:id", isAuth ,activityCategoryController.updateActivityCategory);

router.delete("/delete/:id",isAuth , activityCategoryController.deleteActivityCategory);

module.exports = router;
const express = require("express");
const activityCategoryController = require("../controllers/ActivityCategory");
const router = express.Router();

router.get("/", activityCategoryController.getActivityCategories);

router.post("/create", activityCategoryController.createActivityCategory);

router.put("/update/:id", activityCategoryController.updateActivityCategory);

router.delete("/delete/:id", activityCategoryController.deleteActivityCategory);

module.exports = router;
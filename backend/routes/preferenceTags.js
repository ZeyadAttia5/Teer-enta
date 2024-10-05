const express = require("express");

const router = express.Router();

const preferenceTagController = require("../controllers/preferenceTags");

const isAuth = require("../middlewares/isAuth");

router.get("/", preferenceTagController.getPreferenceTags);

router.post("/create",isAuth , preferenceTagController.createPreferenceTag);

router.put("/update/:id",isAuth , preferenceTagController.updatePreferenceTag);

router.delete("/delete/:id",isAuth , preferenceTagController.deletePreferenceTag);

module.exports = router;
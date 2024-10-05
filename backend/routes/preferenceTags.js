const express = require("express");

const router = express.Router();

const preferenceTagController = require("../controllers/preferenceTags");

router.get("/", preferenceTagController.getPreferenceTags);

router.post("/create", preferenceTagController.createPreferenceTag);

router.put("/update/:id", preferenceTagController.updatePreferenceTag);

router.delete("/delete/:id", preferenceTagController.deletePreferenceTag);

module.exports = router;
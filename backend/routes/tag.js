const express = require("express");
const tagController = require("../controllers/tag");

const router = express.Router();

router.get("/", tagController.getTags);

router.post("/create", tagController.createTag);

router.put("/update/:id", tagController.updateTag);

router.delete("/delete/:id", tagController.deleteTag);

module.exports = router;
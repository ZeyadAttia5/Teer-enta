const express = require("express");
const tagController = require("../controllers/tag");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get("/", tagController.getTags);
router.post("/create", isAuth ,tagController.createTag);
router.put("/update/:id",isAuth , tagController.updateTag);
router.delete("/delete/:id", isAuth ,tagController.deleteTag);




module.exports = router;
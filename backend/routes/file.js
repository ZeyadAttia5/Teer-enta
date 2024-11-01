const router = require('express').Router();
const imageController = require('../controllers/file');

router.post('/file', imageController.uploadFile);
router.post('/files', imageController.uploadFiles);

module.exports = router ;
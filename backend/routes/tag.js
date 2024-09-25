const router = require('express').Router();
const tagController = require('../controllers/tag');

router.post('/create', tagController.createTag ) ;
router.get('/allTags', tagController.getTags);
router.get('/getTag/:id', tagController.getTag);
router.put('/updateTag/:id', tagController.updateTag);

module.exports = router ;
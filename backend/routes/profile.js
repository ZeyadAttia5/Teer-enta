const router = require('express').Router();
const profileController = require('../controllers/profile');

router.post('/create/:id' , profileController.createProfile)
router.get('/:id', profileController.getProfile);
router.put('/update/:id', profileController.updateProfile);

module.exports = router;
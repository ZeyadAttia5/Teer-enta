const router = require('express').Router();
const profileController = require('../controllers/profile');
const imageUploader = require('../middlewares/imageUploader') ;
const isAuth = require("../middlewares/isAuth");
const preferenceTagController = require("../controllers/preferenceTags");



router.get('/:id',isAuth , profileController.getProfile);
router.post('/create/:id' , isAuth ,profileController.createProfile)
router.put('/update/:id'
            , isAuth
            // imageUploader('photoUrl')
            ,profileController.uploadPicture
            ,profileController.manageFieldNames
            , profileController.updateProfile);


module.exports = router;
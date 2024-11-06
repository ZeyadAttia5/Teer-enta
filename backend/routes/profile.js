const router = require('express').Router();
const profileController = require('../controllers/profile');
const imageUploader = require('../middlewares/imageUploader') ;
const isAuth = require("../middlewares/isAuth");
const preferenceTagController = require("../controllers/preferenceTags");
const upload = require('multer')();


router.get('/:id',isAuth , profileController.getProfile);
router.get('/all/addresses/', isAuth, profileController.getAllAddresses); //MS3 98
router.get('/saved/activities',isAuth , profileController.getSavedActivities); //MS3 66
router.post('/save/activity/:id',isAuth , profileController.addSavedActivity); //MS3 66
router.post('/create/:id' , isAuth ,profileController.createProfile)
router.put('/update/:id', isAuth, profileController.updateProfile);
router.put('/add/address/', isAuth, profileController.addAddress); //MS3 98
router.put('/update/picture/:id'
                , isAuth
                ,profileController.uploadPicture
                ,profileController.manageFieldNames,
                profileController.updateProfile) ;

module.exports = router;
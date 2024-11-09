const router = require('express').Router();
const authController = require('../controllers/auth');
const isAuth = require('../middlewares/isAuth');

router.post('/signup' ,authController.signup);
router.post('/login' ,authController.login);
router.post('/changePassword' , isAuth , authController.changePassword)
router.post('/toggleFirstLoginAndUpdatePrefrences' , isAuth , authController.toggleFirstLoginAndUpdatePrefrences)
router.post('/changeAllPasswords' , authController.changeAllpasswords) ;
module.exports = router;
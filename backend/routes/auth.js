const router = require('express').Router();
const authController = require('../controllers/auth');
const isAuth = require('../middlewares/isAuth');

router.post('/signup' ,authController.signup);
router.post('/login' ,authController.login);
router.post('/changePassword' , isAuth , authController.changePassword)

module.exports = router;
const router = require('express').Router();
const accountController = require('../controllers/account');
const isAuth = require('../middlewares/isAuth');

router.delete('/delete/:id',isAuth, accountController.deleteAccount);
router.post('/create',isAuth , accountController.createAccount);
router.get('/pending',isAuth , accountController.getAllPendingUsers);
router.patch('/accept/:id',isAuth , accountController.acceptRequest);
router.patch('/reject/:id' ,isAuth , accountController.rejectRequest) ;
router.get('/accepted', isAuth ,accountController.getAllAcceptedUsers);
router.get('/all' ,isAuth , accountController.getAllUsers) ;
router.post('/requestDeleteMy', isAuth ,accountController.requestDeleteMyAccount);

module.exports = router;
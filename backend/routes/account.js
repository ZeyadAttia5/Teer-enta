const router = require('express').Router();
const accountController = require('../controllers/account');
const isAuth = require('../middlewares/isAuth');


router.get('/accepted', isAuth ,accountController.getAllAcceptedUsers);
router.get('/pending',isAuth , accountController.getAllPendingUsers);
router.get('/all' ,isAuth , accountController.getAllUsers)
router.get('/preferences', accountController.getAllPreferences);
router.post('/create',isAuth ,accountController.createAccount);
router.post('/acceptTermsAndConditions',isAuth , accountController.acceptTermsAndConditions);
router.post('/requestAccountDeletion' , accountController.requestMyAccountDeletion) ;
router.put("/choosePreferences",isAuth , accountController.chooseMyPreferences);
router.patch('/reject/:id' ,isAuth , accountController.rejectRequest) ;
router.patch('/accept/:id',isAuth , accountController.acceptRequest);
router.delete('/delete/:id',isAuth, accountController.deleteAccount);


module.exports = router;
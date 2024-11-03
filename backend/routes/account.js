const router = require('express').Router();
const upload = require('multer')() ;
const accountController = require('../controllers/account');
const isAuth = require('../middlewares/isAuth');
const decodeToken = require('../middlewares/decodeToken');


router.get('/accepted', isAuth ,accountController.getAllAcceptedUsers);
router.get('/pending',isAuth , accountController.getAllPendingUsers);
router.get('/all' ,isAuth , accountController.getAllUsers)
router.get('/preferences', accountController.getAllPreferences);
router.post('/create',isAuth ,accountController.createAccount);
router.post('/acceptTermsAndConditions',isAuth , accountController.acceptTermsAndConditions);
router.put("/choosePreferences",isAuth , accountController.chooseMyPreferences);
router.patch('/reject/:id' ,isAuth , accountController.rejectRequest) ;
router.patch('/accept/:id',isAuth , accountController.acceptRequest);
router.patch('/upload/idCard' ,accountController.uploadId);
router.patch('/upload/taxationCard',isAuth ,accountController.uploadTaxationRegistery);
router.patch('/upload/certificates' , isAuth   , accountController.uploadCertificates);
router.patch('/redeemPoints',isAuth, accountController.redeemPoints);
router.patch('/chooseCurrency/:id' , isAuth , accountController.chooseMyCurrency) ;
router.delete('/requestAccountDeletion', isAuth, accountController.requestMyAccountDeletion) ;
router.delete('/delete/:id',isAuth, accountController.deleteAccount);


module.exports = router;
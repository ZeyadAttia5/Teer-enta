const router = require('express').Router();
const upload = require('multer')() ;
const accountController = require('../controllers/account');
const isAuth = require('../middlewares/isAuth');
const decodeToken = require('../middlewares/decodeToken');


router.get('/accepted', isAuth ,accountController.getAllAcceptedUsers);
router.get('/pending',isAuth , accountController.getAllPendingUsers);
router.get('/all' ,isAuth , accountController.getAllUsers)
router.get('/preferences', accountController.getAllPreferences);
router.get('/suggestedActivites' , isAuth,accountController.getSuggestedActivites) ;
router.get('/suggestedItinerary' , isAuth,accountController.getSuggestedItinerary) ;
router.get('/requestedAccountsDeletion', isAuth, accountController.getAllAccountsDeletionRequests) ;
router.post('/create',isAuth ,accountController.createAccount);
router.post('/requestAccountDeletion', isAuth, accountController.requestMyAccountDeletion) ;
router.post('/acceptTermsAndConditions',isAuth , accountController.acceptTermsAndConditions);
router.put("/choosePreferences",isAuth , accountController.chooseMyPreferences);
router.patch('/reject/:id' ,isAuth , accountController.rejectRequest) ;
router.patch('/accept/:id',isAuth , accountController.acceptRequest);
router.patch('/upload/idCard' ,accountController.uploadId);
router.patch('/upload/taxationCard',isAuth ,accountController.uploadTaxationRegistery);
router.patch('/upload/certificates' , isAuth   , accountController.uploadCertificates);
router.patch('/redeemPoints',isAuth, accountController.redeemPoints);
router.patch('/receiveBadge',isAuth, accountController.receiveBadge);
router.patch('/chooseCurrency/:id' , isAuth , accountController.chooseMyCurrency) ;
router.delete('/delete/:id',isAuth, accountController.deleteAccount);
router.delete('/approveDeleteRequest/:id', isAuth, accountController.approveAccountsDeletionRequest);
router.delete('/rejectDeleteRequest/:id', isAuth, accountController.rejectRequest);


module.exports = router;
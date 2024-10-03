const router = require('express').Router();
const accountController = require('../controllers/account');

router.delete('/delete/:id', accountController.deleteAccount);
router.post('/create', accountController.createAccount);
router.get('/pending', accountController.getAllPendingUsers);
router.patch('/accept/:id', accountController.acceptRequest);
router.patch('/reject/:id' , accountController.rejectRequest) ;
router.get('/accepted', accountController.getAllAcceptedUsers);
router.get('/all' , accountController.getAllUsers) ;

module.exports = router;
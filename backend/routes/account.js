const router = require('express').Router() ;
const accountController =  require('../controllers/account') ;

router.delete('/delete/:id', accountController.deleteAccount) ;
router.post('/create' , accountController.createAccount ) ;     
router.get('/pending' , accountController.getAllPendingUsers) ;
router.patch('/accept/:id' , accountController.acceptRequest) ;

module.exports = router ;
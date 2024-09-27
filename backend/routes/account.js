const router = require('express').Router() ;
const accountController =  require('../controllers/account') ;

router.delete('/delete/:id', accountController.deleteAccount) ;
router.post('/create' , accountController.deleteAccount ) ;

module.exports = router ;
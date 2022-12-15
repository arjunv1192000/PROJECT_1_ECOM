var express = require('express');
const { userlogin,usersignup,signup,uselog,homerender,acclog,productpage } = require('../Controller/user_controller');
var router = express.Router();
var user_controller=require('../Controller/user_controller')

/* GET home page. */
router.get('/',homerender );
router.get('/uselogin',acclog)
router.get('/signup',usersignup);
router.post('/usersign',signup);
router.post('/userlog',uselog);
router.get('/productdetails/:id',productpage)






module.exports = router;

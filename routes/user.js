var express = require('express');
const { userlogin,usersignup,signup,uselog,homerender,acclog,productpage,sessioncheck,acclogout ,nocache,loginredirect,cartpage,listproductpage,filterproduct} = require('../Controller/user_controller');
var router = express.Router();
var user_controller=require('../Controller/user_controller')

/* GET home page. */
router.get('/',homerender);
router.get('/uselogin',nocache,loginredirect,acclog)
router.get('/signup',usersignup);
router.post('/usersign',signup);
router.post('/userlog',uselog);
router.get('/productdetails/:id',sessioncheck,productpage)
router.get('/uselogout',acclogout)
router.get('/usercart',cartpage)
router.get('/showproduct',sessioncheck,listproductpage)
router.post('/categoryfilter',filterproduct)






module.exports = router;

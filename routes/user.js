var express = require('express');
const { userlogin,usersignup,signup,uselog,homerender,acclog,productpage,sessioncheck,acclogout ,nocache,loginredirect,cartpage,listproductpage,filterproduct,cartaddd,quantityproduct,removeitem,checkout,orderplace,orders} = require('../Controller/user_controller');
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
router.get('/usercart',sessioncheck,cartpage)
router.get('/showproduct',sessioncheck,listproductpage)
router.post('/categoryfilter',sessioncheck,filterproduct)
router.get('/add-tocart/:id',sessioncheck,cartaddd)
router.post('/change_product-quantity',quantityproduct)
router.post('/product_remove',removeitem)
router.get('/checkout_order',sessioncheck,checkout)
router.post('/place-order',sessioncheck,orderplace)
router.get('/userorders',sessioncheck,orders)






module.exports = router;

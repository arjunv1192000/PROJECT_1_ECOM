var express = require('express');
const { usersignup,signup,uselog,homerender,acclog,productpage,sessioncheck,acclogout ,nocache,loginredirect,cartpage,listproductpage,filterproduct,cartaddd,quantityproduct,removeitem,checkout,orderplace,orders,cancelorder,otpnumberpage,otp_authentication,otpverify,userorderproduct,addtowishlist,wishlistpage,userAcdata,sucesspage,paymentVerify,getadd_page,Add_address,gettcurrentAddress,password,offerpage,checkcoupon,searchproduct,priceFilter,pricesorting,shippingdetails,orderreturn,invoicegenerator,} = require('../Controller/user_controller');
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

router.post('/cancelorder/:id',sessioncheck,cancelorder)

router.post('/otpnumber',otpnumberpage)

router.post('/numberverification',otp_authentication)

router.post('/verifyOTP',otpverify)

router.get('/orderproduct/:id',userorderproduct)  

router.get('/add-towishlist/:id',addtowishlist)

router.get('/userwishlist',wishlistpage)

router.get('/uaseraccount',sessioncheck,userAcdata)

router.get('/orderplaced',sucesspage)

router.post('/verify_payment',paymentVerify)

router.get('/add_address',sessioncheck,getadd_page)

router.post('/newaddaddress',Add_address)

router.get('/getAdd/:id',gettcurrentAddress)

router.post('/changepassword',password)

router.get('/showoffers',sessioncheck,offerpage)

router.post('/checkcoupon',checkcoupon)

router.post('/search',searchproduct)

router.post('/price',priceFilter)

router.post('/pricesort',pricesorting)


router.get('/shippment/:id',sessioncheck,shippingdetails)  

router.post('/returnorder/:id',orderreturn)

router.post('/setinvoice/:id',sessioncheck,invoicegenerator)  







module.exports = router;

var express = require('express');
const { adminloginpage,adminlog,adminhome,userdata,productdata,productadd,editproduct,addproducts,editsubmit,removeproduct,categorymanage,categoryadd,categoryeditpage,categoryeditsubmit,removecategory,blockmanager,acclogout,userorders,orderproducts,productmanage,cancelorders,couponpage,couponsubmit,coupondata,couponeditpage,couponeditsubmit,couponremove,bannerpage,editbannerpage,submit_banner,getreportpage,updateshipping,getadmindashbord,getofferpage,getaddproduct,getprosubmit,productoffersub,getcatofferform,catoffersubmit,confirmreturn,productofferremove,categoryofferremove} = require('../Controller/admin_controller');
var router = express.Router();

/* GET users listing. */
router.get('/',adminloginpage);

router.post('/login',adminlog);

router.get('/userdetails',userdata);

router.get('/Dashboard',adminhome);

router.get('/products',productdata);

router.get('/add-stock-page',productadd);

router.get('/edit-pro/:id',editproduct);

router.post('/edit_product-submit/:id',editsubmit)

router.post('/add_product-submit',addproducts)

router.get('/delete-pro/:id',removeproduct)

router.get('/category-page',categorymanage)

router.post('/category-add',categoryadd)

router.get('/edit-category/:id',categoryeditpage)

router.post('/category-edit_submit/:id',categoryeditsubmit)

router.get('/delete-category/:id',removecategory)

router.post('/Block/:id',blockmanager)

router.get('/adminlogout',acclogout)

router.get('/orders',userorders)

router.get('/orderproduct/:id',orderproducts)

router.post('/delete-pro/:id',productmanage)

router.post('/cancelorders/:id',cancelorders)

router.get('/Couponadd_page',couponpage)

router.post('/Coupon_add',couponsubmit)

router.get('/coupon-page',coupondata)

router.get('/edit-coupon/:id',couponeditpage)

router.post('/Coupon_edit/:id',couponeditsubmit)

router.get('/delete-coupon/:id',couponremove)

router.get('/banner-page',bannerpage)

router.get('/add-banner-page/:id',editbannerpage)

router.post('/add_banner_submit',submit_banner)

router.get('/report-page',getreportpage)

router.post('/shippingStatus/:id',updateshipping)

router.get('/getdashbord',getadmindashbord)

router.get('/offer-page',getofferpage)

router.get('/getproductof',getaddproduct)

router.get('/Addpro_offer/:id',getprosubmit)

router.post('/proOffer_add',productoffersub)

router.post('/addoffer-category',getcatofferform)

router.post('/catOffer_add',catoffersubmit)

router.post('/return_confirm/:id',confirmreturn)

router.get('/deleteproductoffer/:id',productofferremove)

router.get('/deletecategoryoffer/:id',categoryofferremove)












module.exports = router; 
  
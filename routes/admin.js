var express = require('express');
const { adminloginpage,adminlog,adminhome,userdata,productdata,productadd,editproduct,addproducts,editsubmit,removeproduct,categorymanage,categoryadd,categoryeditpage,categoryeditsubmit,removecategory,blockmanager,acclogout,userorders,orderproducts,productmanage,cancelorders} = require('../Controller/admin_controller');
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










module.exports = router; 
  
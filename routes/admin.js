var express = require('express');
const { adminloginpage,adminlog,userdata,productdata,productadd,editproduct,addproducts,editsubmit,removeproduct,categorymanage,categoryadd,categoryeditpage,categoryeditsubmit,removecategory} = require('../Controller/admin_controller');
var router = express.Router();

/* GET users listing. */
router.get('/',adminloginpage);

router.post('/login',adminlog);

router.get('/userdetails',userdata);

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








module.exports = router; 
  
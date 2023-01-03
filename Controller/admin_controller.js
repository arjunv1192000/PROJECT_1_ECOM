
const multer = require('multer');
const upload = multer({ dest: './public/product_img/' });

const {  Adminlogin,GetAlluserdata,adminadd,Getproductdata,adminedit,updateproduct,deleteproduct,addcategory,gettcategory,editsubmit,updatecategory,deletecategory, userblock,Getcategorydata,getAlluserorder,getAllorderproducts,productstatus,Cancelproduct_orders,addcoupons, Getcoupondata,updatecoupon,couponupdate,deletecoupon,getbannerTopage} = require('../Model/admin_helper')

module.exports={




    adminloginpage(req, res, next) {
        res.render('admin/adminlog');
      },

      adminlog(req, res, next) {
        Adminlogin(req.body).then((admininfo)=>{


          
          res.render('admin/admindashboard', {user:false});
        }).catch((error)=>{
          res.render('admin/adminlog')
      
        })

        
       
      },

      adminhome(req,res){
        
        res.redirect('admin/login')

      },


      userdata(req, res, next) {
        GetAlluserdata().then((userdata)=>{
          res.render('admin/userdata',{user:false,userdata})
      
        })

       
      },
      productdata(req, res) {
        Getproductdata().then((product,)=>{
          res.render('admin/productdetails',{user:false,product})
      
      
        })

        
          
    

       
      },
      productadd(req, res, next) {
        Getcategorydata().then((category)=>{
          res.render('admin/addproducts',{user:false,category})
      
      
        })
        
        
    
  

     
    },

    editproduct(req, res) {
      let productid=req.params.id
      adminedit(productid).then((product)=>{
      res.render('admin/editproducts',{user:false,product})

    })
        
     
  


   
  },
  addproducts(req,res){
    var image=req.files.Image
    console.log(req.body);
    adminadd(req.body).then((data)=>{
      console.log(req.file);
      image.mv('./public/product_img/'+data.id+'.jpg',(err,done)=>{
        if(err){
          console.log(err);

        }else{
          res.redirect('/admin/products')

        }
      })
    }).catch((err)=>{
      console.log(err);
    })


  },
  editsubmit(req,res){
    var id=req.params.id
    updateproduct(req.params.id,req.body).then(()=>{
      res.redirect('/admin/products')
      if(req.files.Image){
        var image=req.files.Image
        image.mv('./public/product_img/'+id+'.jpg')

      }

    })
    
  },
  removeproduct(req,res){
    deleteproduct(req.params.id).then(()=>{
      res.redirect('/admin/products')

    })

  },


  categorymanage(req,res){
    gettcategory().then((catdatas)=>{
      res.render('admin/categorypage',{user:false,catdatas})

    })
    
      


  },
  categoryadd(req,res){
    addcategory(req.body).then(()=>{
      res.redirect('/admin/category-page')


    })
  },
  categoryeditpage(req,res){
    updatecategory(req.params.id).then((data)=>{
      console.log(req.params.id);
      res.render('admin/categoryedit',{user:false,data})
      
    })

    


  },
  categoryeditsubmit(req,res){
     editsubmit(req.params.id,req.body).then(()=>{
      res.redirect('/admin/category-page')

    })

  },
  removecategory(req,res){
    deletecategory(req.params.id).then(()=>{
      res.redirect('/admin/category-page')

    })

  },
  blockmanager(req,res){
    userblock(req.params.id,req.body.status).then(()=>{
      req.session.users=null
      res.redirect('/admin/userdetails')

    })

    console.log(req.body);
    console.log(req.params.id);
  },

  acclogout(req,res){
    res.redirect('/admin')
  },
  userorders(req,res){
    getAlluserorder().then((Allorder)=>{

      res.render('admin/ordermanagement_page',{user:false,Allorder})

    })
  },
  orderproducts(req,res){
    console.log(req.params.id,'****************************');
    getAllorderproducts(req.params.id).then((singleproduct)=>{

      res.render('admin/order_productdetails',{user:false,singleproduct})



    })
  },

  productmanage(req,res){
    productstatus(req.params.id,req.body.stock).then((response)=>{

      res.redirect('/admin/products')

    })
  },
  cancelorders(req,res){
    Cancelproduct_orders(req.params.id,req.body.status).then(()=>{

      res.redirect('/admin/orders')


    })



  },
  couponpage(req,res){
    res.render('admin/coupon_add',{user:false})
  },
  couponsubmit(req,res){
    addcoupons(req.body).then(()=>{
      res.redirect('/admin/coupon-page')

    })
  },
  coupondata(req,res){
    Getcoupondata().then((coupons)=>{
      res.render('admin/show_coupon',{user:false,coupons})

    })
  },
  couponeditpage(req,res){
    updatecoupon(req.params.id).then((coupondata)=>{

      res.render('admin/coupon_edit',{user:false,coupondata})


    })

   
  },
  couponeditsubmit(req,res){
    couponupdate(req.params.id,req.body).then(()=>{
      res.redirect('/admin/coupon-page')

    })

  },
  couponremove(req,res){
    deletecoupon(req.params.id).then(()=>{
      res.redirect('/admin/coupon-page')

    })

  },
  bannerpage(req,res){
    getbannerTopage().then((bannerdata)=>{
      res.render('admin/showbanner',{user:false,bannerdata})

    })
   

  },
  editbannerpage(req,res){
    res.render('admin/edit_banner',{user:false})
    

  },
  submit_banner(req,res){
    if(req.files.Image1){
      var image1=req.files.Image1
      image1.mv('./public/banner_img/63b278767079c39a64a170fb.jpg')
      var image2=req.files.Image2
  }else if(req.files.Image2){
    var image2=req.files.Image2
    image2.mv('./public/banner_img/63b278767079c39a64a170fb.jpg')
  }else if(req.files.Image3){
    var image3=req.files.Image3
    image3.mv('./public/banner_img/63b278947079c39a64a170fd.jpg')
  }
  res.redirect('/admin/banner-page')
}

      
        
       
      }



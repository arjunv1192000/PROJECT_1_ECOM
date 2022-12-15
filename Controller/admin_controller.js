const {  Adminlogin,GetAlluserdata,adminadd,Getproductdata,adminedit,updateproduct,deleteproduct,addcategory,gettcategory,editsubmit,updatecategory,deletecategory} = require('../Model/admin_helper')

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
      userdata(req, res, next) {
        GetAlluserdata().then((userdata)=>{
          res.render('admin/userdata',{user:false,userdata})
      
        })

       
      },
      productdata(req, res) {
        Getproductdata().then((product)=>{
          res.render('admin/productdetails',{user:false,product})
      
      
        })

        
          
    

       
      },
      productadd(req, res, next) {
        
        res.render('admin/addproducts',{user:false})
    
  

     
    },

    editproduct(req, res) {
      let productid=req.params.id
      console.log(productid);
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
    updateproduct(req.params.id,req.body).then(()=>{
      res.redirect('/admin/products')

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

  }



      
        
       
      }



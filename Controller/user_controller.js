const { Getcategorydata } = require('../Model/admin_helper');
const { userSignup, Dologin ,showproducts, productAlldetails, Getcategory,filterBycategory} = require('../Model/user_helper');

module.exports={

   sessioncheck:(req,res,next)=>{
    console.log(req.session.user);
    if(req.session.user){
      next();
    }else{

    res.redirect('/uselogin')
    }

   },


   nocache(req, res, next){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  },

  loginredirect(req,res,next){
    if(!req.session.user){
      req.session.loggedIn=false;
  
    }
    if(req.session.user){ 
      res.redirect('/')
    }else{
      next();
    }
  },



    userlogin(req, res, next) {
        res.render('user/home', {user:true});
      },





      usersignup(req,res,){
        res.render('user/signup',{});
        
      },




      signup(req,res){
        userSignup(req.body).then((data)=>{
          req.session.loggledIn=true;
          req.session.user=data
          res.redirect('/')
        }).catch((error)=>{
          res.render('user/signup',{ error: `${error.error}` })
      
        })

        
       
      },



      uselog(req,res){
        Dologin(req.body).then((user)=>{
          req.session.loggledIn=true;
          req.session.user=user
           console.log(req.session.user,'*************************');
          res.redirect('/')
          
        }).catch((error)=>{
        
          
          res.render('user/login', { error: `${error.error}` })
       
        })
      
       
      },
      homerender(req,res){
        let users=req.session.user
        console.log(users);
        showproducts().then((showproduct)=>{
        res.render('user/home',{user:true,showproduct,users})

        })
        

      },
       acclog(req,res){
        res.render('user/login')

      },
      productpage(req,res){
        let users=req.session.user
        productAlldetails(req.params.id).then((productDATA)=>{
          res.render('user/Productdetailspage',{user:true,productDATA,users})

        })
      },
      acclogout(req,res){
        req.session.user=null;
        req.session.loggedIn=false;

        res.redirect('/')

      },
      cartpage(req,res){
        let users=req.session.user

        res.render('user/cart',{user:true,users})

      },
      listproductpage(req,res){
        let users=req.session.user
        console.log(users);
        showproducts().then((showproduct)=>{

          Getcategory().then((catdatas)=>{

            res.render('user/showproduct',{user:true,showproduct,users,catdatas})

          })
        

        })


      },
      filterproduct(req,res){
        let users=req.session.user
        let name = req.body;
        console.log(users);
        console.log(name);
        filterBycategory(name).then((showproduct)=>{

          Getcategory().then((catdatas)=>{

            res.render('user/showproduct',{user:true,showproduct,users,catdatas})

          }).catch(()=>{

            res.render('user/showproduct',{user:true,showproduct,users,catdatas})

          })


         

        })
      }

}
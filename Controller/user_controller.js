const { userSignup, Dologin ,showproducts, productAlldetails} = require('../Model/user_helper');

module.exports={

    userlogin(req, res, next) {
        res.render('user/home', {user:true});
      },





      usersignup(req,res,){
        res.render('user/signup',{});
        
      },




      signup(req,res){
        userSignup(req.body).then((userinfo)=>{
          
          res.redirect('/home')
        }).catch((error)=>{
          res.render('user/signup')
      
        })

        
       
      },



      uselog(req,res){
        Dologin(req.body).then((userinfo)=>{
          
          res.redirect('/home')
          
        }).catch((error)=>{
        
          
          res.render('user/login')
       
        })
      
       
      },
      homerender(req,res){
        showproducts().then((showproduct)=>{
        res.render('user/home',{user:true,showproduct})

        })
        

      },
       acclog(req,res){
        res.render('user/login')

      },
      productpage(req,res){
        productAlldetails(req.params.id).then((productDATA)=>{
          res.render('user/Productdetailspage',{user:true,productDATA})

        })
      }

}
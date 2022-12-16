const { userSignup, Dologin ,showproducts, productAlldetails} = require('../Model/user_helper');

module.exports={

   sessioncheck:(req,res,next)=>{
    if(req.session.user){
      next();
    }else{

    res.redirect('/uselogin')
    }

   },




    userlogin(req, res, next) {
        res.render('user/home', {user:true});
      },





      usersignup(req,res,){
        res.render('user/signup',{});
        
      },




      signup(req,res){
        userSignup(req.body).then((userinfo)=>{
          req.session.loggledIn=true;
          req.session.user=req.body.useremail
          res.redirect('/')
        }).catch((error)=>{
          res.render('user/signup',{ error: `${error.error}` })
      
        })

        
       
      },



      uselog(req,res){
        Dologin(req.body).then((userinfo)=>{
          req.session.loggledIn=true;
          req.session.user=req.body.useremail
          
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

      }

}
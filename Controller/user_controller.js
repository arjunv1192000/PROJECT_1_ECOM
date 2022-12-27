const { response } = require('../app');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_TOKEN;
const serviceToken = process.env.Service_ID;
const client = require("twilio")(accountSid,authToken,serviceToken);
const { Getcategorydata } = require('../Model/admin_helper');
const { userSignup, Dologin ,showproducts, productAlldetails, Getcategory,filterBycategory,productcart,Getcartproducts,changeproductquantity, removeproduct_cart, gettotalamount,placeorder,getCartproductlist,getorderdetails,Cancelproduct_order,findByNumber,getAllorderproducts,product_wishlist} = require('../Model/user_helper');

let usersession ;

module.exports={

   sessioncheck:(req,res,next)=>{
    console.log(req.session.users);
    if(req.session.users){
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
    if(!req.session.users){
      req.session.loggedIn=false;
  
    }
    if(req.session.users){ 
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
        console.log(req.body);
        userSignup(req.body).then((user)=>{
          req.session.loggledIn=true;
          req.session.users=req.body
          console.log(req.session.user);
          res.redirect('/')
        }).catch((error)=>{
          res.render('user/signup',{ error: `${error.error}` })
          
        })

        
       
      },



      uselog(req,res){
        Dologin(req.body).then((user)=>{
          req.session.loggledIn=true;
          req.session.users=user
          res.redirect('/')

        }).catch((error)=>{
        
          
          res.render('user/login', { error: `${error.error}` })
       
        })
      
       
      },
      homerender(req,res){
        let users=req.session.users
        showproducts().then((showproduct)=>{
        res.render('user/home',{users,user:true,showproduct})

        })
        

      },
       acclog(req,res){
        res.render('user/login')

      },
      productpage(req,res){
        let users=req.session.users
        productAlldetails(req.params.id).then((productDATA)=>{
          res.render('user/Productdetailspage',{user:true,productDATA,users})

        })
      },
      acclogout(req,res){
        req.session.users=null;
        req.session.loggedIn=false;

        res.redirect('/')

      },
        cartpage (req,res){
        let users=req.session.users
        console.log(req.session.users._id);
        Getcartproducts(req.session.users._id).then((product)=>{

          gettotalamount(req.session.users._id).then((totalprice)=>{
        
          res.render('user/cart',{user:true,users,product,totalprice})
          }).catch(()=>{

          })

        })

       

      },
      listproductpage(req,res){
        let users=req.session.users
        console.log(users);
        showproducts().then((showproduct)=>{

          Getcategory().then((catdatas)=>{

            res.render('user/showproduct',{user:true,showproduct,users,catdatas})

          })
        

        })


      },
      filterproduct(req,res){
        let users=req.session.users
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
      },
      cartaddd(req,res){
        productcart(req.params.id,req.session.users._id).then(()=>{
          res.json({status:true})
          
        })

      },
      quantityproduct(req,res,next){
        console.log(req.body);
        changeproductquantity(req.body).then((response)=>{
          res.json(response)

        }).catch(()=>{

        })
      },

      removeitem(req,res){
        removeproduct_cart(req.body).then((response)=>{
          res.json(response)

        })
      },
      checkout(req,res){
        let users=req.session.users
        gettotalamount(req.session.users._id).then((totalprice)=>{
          Getcartproducts(req.session.users._id).then((product)=>{
            res.render('user/checkout',{user:true,users,totalprice,product})
        
          })

        })
      },
      orderplace(req,res){
        let users=req.session.users
        getCartproductlist(req.body.userId).then((product)=>{
        gettotalamount(req.body.userId).then((totalprice)=>{
        placeorder(req.body,product,totalprice).then((response)=>{
          res.render('user/orderplaced',{users})
          


        })
      })
    })
        console.log(req.body);
        
      
      },
      orders(req,res){
        let users=req.session.users
        getorderdetails(req.session.users._id).then((orders)=>{
          console.log(orders);
          res.render('user/orders',{user:true,orders,users})

        })
      },
      cancelorder(req,res){
        Cancelproduct_order(req.params.id,req.body.status).then(()=>{
          res.redirect('/userorders')


        })
      },
      otpnumberpage(req,res){
        res.render('user/OTP')
      },

      otp_authentication(req,res){
        number = req.body.phone;
  if (number.substring(0, 3) !== '+91') {
    number = `+91${number}`;
  }
  console.log(number);
  // accound finding
  findByNumber(req.body.phone).then((user) => { 
  console.log(user);
  usersession=user
    client.verify
      .services(process.env.Service_ID)
      .verifications.create({
        to: number,
        channel: 'sms',
      })
      .then(() => {
        res.render('user/verificationotp');
      })
      .catch((err) => {
        console.log(err);
      });
  })
    .catch((err) => {
      res.render('user/OTP', { error: err });
    });

      },
      otpverify(req,res){
        console.log(req.body.otp);
        client.verify
    .services(process.env.Service_ID)
    .verificationChecks.create({
      to: number,
      code: req.body.otp,
    }).then(async (data) => {
      if (data.status === 'approved') {
        req.session.users=usersession
         res.redirect('/');
      } else {
        console.log('OTP not matched');
        res.render('user/verificationotp', { error: 'invalied OTP' });
      }
    })
      },
      userorderproduct(req,res){
        let users=req.session.users
        getAllorderproducts(req.params.id).then((singleproduct)=>{

          res.render('admin/order_productdetails',{user:true,singleproduct,users})
    
    
    
        })

      },
      addtowishlist(req,res){
        console.log(req.params.id);
        product_wishlist(req.params.id,req.session.users._id).then(()=>{
          res.json({status:true})
          
        })


      }
      

}



  
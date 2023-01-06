const { response } = require('../app');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_TOKEN;
const serviceToken = process.env.Service_ID;
const client = require("twilio")(accountSid,authToken,serviceToken);
const { Getcategorydata } = require('../Model/admin_helper');
const { userSignup, Dologin ,showproducts, productAlldetails, Getcategory,filterBycategory,productcart,Getcartproducts,changeproductquantity, removeproduct_cart, gettotalamount,placeorder,getCartproductlist,getorderdetails,Cancelproduct_order,findByNumber,getAllorderproducts,product_wishlist, get_productwishlist,get_userdata,generateRazorpay,verifyPayment,changepaymentStatus,adduseraddress,GetUseraddress,changepassword,getoffers,couponmanagement,getsearchproduct,showproductshome,getPriceFilter} = require('../Model/user_helper');

var forgote;
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
        showproductshome().then((showproduct)=>{
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
            if(product.length!=0){
          res.render('user/cart',{user:true,users,product,totalprice})


            }else{
              res.render('user/empty-cart',{user:true,users})


            }
        
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
        let finalprice
        let a=totalprice
        console.log(req.body);
        if(req.body.offerdata){
         finalprice=req.body.offerdata;
        }else{
          finalprice=a;

        }
          

        
        getCartproductlist(req.body.userId).then((product)=>{
         totalprice= gettotalamount(req.body.userId).then((totalprice)=>{
        placeorder(req.body,product,finalprice).then((orderId)=>{
          if(req.body['payment_method']==='COD'){
            res.json({CODsucess:true})

          }else{
            generateRazorpay(orderId,totalprice).then((response)=>{
              res.json(response)

            })

          }
         
           


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
        if(req.body.data=="true"){
           forgote=true
        }else{
           forgote=false
        }
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
  if(forgote){
    var userdata=user._id
  }
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
        if(forgote){
          res.render('user/changepassword',{usersession})

        }else{
          res.redirect('/');

        }
         
      } else {
        console.log('OTP not matched');
        res.render('user/verificationotp', { error: 'invalied OTP' });
      }
    })
      },
      userorderproduct(req,res){
        let users=req.session.users
        getAllorderproducts(req.params.id).then((singleproduct)=>{

          res.render('user/order_productdetails',{user:true,singleproduct,users})
    
    
    
        })

      },
      addtowishlist(req,res){
        console.log(req.params.id);
        product_wishlist(req.params.id,req.session.users._id).then(()=>{
          res.json({status:true})
          
        })


      },
      wishlistpage(req,res){
        let users=req.session.users
        get_productwishlist(req.session.users._id).then((wishproduct)=>{
          res.render('user/wishlist',{user:true,wishproduct,users})

        })
      },
      userAcdata(req,res){
        let users=req.session.users
        get_userdata(req.session.users._id).then((userdata)=>{

          getorderdetails(req.session.users._id).then((orders)=>{
            
            res.render('user/myaccountpage',{user:true,userdata,orders,users})
  
          })
          


         

        })
        
        

      },

      sucesspage(req,res){
        let users=req.session.users
        res.render('user/orderplaced',{users})

      },
      paymentVerify(req,res){
        console.log(req.body);

        verifyPayment(req.body).then(()=>{

          changepaymentStatus(req.body['order[receipt]']).then(()=>{
            console.log("payment sucessfull");
            res.json({status:true})
          }).catch((err)=>{
            res.json({status:false})

          })

        })
        
      },
      getadd_page(req,res){
        let users=req.session.users
        res.render('user/useraddressAdd',{users})

      },
      Add_address(req,res){
        let users=req.session.users
        adduseraddress(req.body).then(()=>{

          res.redirect('/uaseraccount');
         

        })
      },
      gettcurrentAddress(req,res){
        console.log(req.params.id);
       
        GetUseraddress(req.params.id).then((userdata)=>{

          res.json(userdata)

        })

      },
      password(req,res){
        console.log(req.body);
        changepassword(req.body.userId,req.body).then(()=>{
          res.redirect('/uselogin')
          


        })
      },
      offerpage(req,res){
        let users=req.session.users
        getoffers().then((coupondata)=>{
          res.render('user/offers',{user:true,users,coupondata})

        })
      },
      checkcoupon(req,res){
        couponmanagement(req.body.data,req.body.total).then((response)=>{
          res.json(response)

        })

      },
      searchproduct(req,res){
        console.log(req.body.searchValue,"+++++++++++++++++++++++++++");
        getsearchproduct(req.body.searchValue).then((data)=>{
          console.log(data,"////////////////////////");
          res.json(data)

        })
      },
      priceFilter(req,res){
        console.log(req.body);
        let users=req.session.users

        getPriceFilter(req.body.min,req.body.max).then((showproduct)=>{

          Getcategory().then((catdatas)=>{

            res.render('user/showproduct',{user:true,showproduct,users,catdatas})

          })
    
        })
    
       }
     

      

}



  
var db=require('./Connection')
var collections=require('./Collection')
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')
const { response } = require('../app')
const { Product_Collecction } = require('./Collection')
const { promiseImpl } = require('ejs')
const Razorpay=require('razorpay')
var instance = new Razorpay({ key_id: 'rzp_test_2OQT5vz8WgTGvO', key_secret: 'G6vMKKvkkG7mTw32cfp1ziP3' })

module.exports={


    userSignup:(userinfo)=>{
        userinfo.isblocked=false
        return new Promise(async(resolve,reject)=>{
            
            let user=await db.get().collection(collections.USER_Collection).findOne({useremail:userinfo.useremail})
            console.log(user);
            if(user){
                
                reject({error:'Email allready exist'})
            }else{
                userinfo.pass=await bcrypt.hash(userinfo.pass,10)

            db.get().collection(collections.USER_Collection).insertOne(userinfo).then(( )=>{
                
                 resolve( )


            }).catch((error)=>{
                

                reject(error) 
            })

            }

        })   

    },
    


    Dologin:(userinfo)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collections.USER_Collection).findOne({useremail:userinfo.useremail})
            console.log(user);
            if(user){
                
                 if(user.isblocked){
                    reject({error:"user is blocked"})
                 }else{
                    bcrypt.compare(userinfo.pass,user.pass).then((status)=>{
                        if(status){
                            resolve(user)
                        }else{
                            reject({error:"password"})
                        }
    
                    })
                    
                 }
                  

            }else{
                reject({error:"Email"})
            }


        })
    },
    showproducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let showproduct=await db.get().collection(collections.Product_Collecction).find().toArray()
            console.log(showproduct);
            resolve(showproduct)
        })

    },
    productAlldetails:(prID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.Product_Collecction).findOne({_id:ObjectId(prID)}).then((productDATA)=>{

                resolve(productDATA)
            })
        })
       
            

    },

    Getcategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let catdatas=await db.get().collection(collections.category_Collecction).find().toArray()
            
            resolve(catdatas)
        }).catch((error)=>{
                

                reject() 
            })

    },
    filterBycategory:(procate)=>{
        return new Promise(async(resolve,reject)=>{
            let showproduct=await db.get().collection(collections.Product_Collecction).find({category:procate.name}).toArray()
            console.log(showproduct);
           
                resolve(showproduct)
                           
        }).catch((error)=>{
                

                reject() 
            })

    },
    productcart:(proID,userId)=>{
        let proObj={
            item:ObjectId(proID),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let cartdata=await db.get().collection(collections.CART_Collection).findOne({user:ObjectId(userId)})

            if(cartdata){
                let proExist=cartdata.product.findIndex(product=>product.item==proID)
                console.log(proExist);
                if(proExist!=-1){
                    await  db.get().collection(collections.CART_Collection).updateOne({user:ObjectId(userId),'product.item':ObjectId(proID)}, {$inc:{'product.$.quantity':1} }
                    ).then(()=>{
                        resolve()
                    }).catch(()=>{
                        reject()
                    })

                }else{
                    await  db.get().collection(collections.CART_Collection).updateOne({user:ObjectId(userId)},
                {
                    $push:{product:proObj}
                }
                ).then((response)=>{
                    resolve()
                })

                }
               

            }else{
                cartObj={
                    user:ObjectId(userId),
                    product:[proObj]
                }
              await  db.get().collection(collections.CART_Collection).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
        

    },
    Getcartproducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            cartItems=await db.get().collection(collections.CART_Collection ).aggregate([
            {
                $match:{user:ObjectId(userId)}


           },
           {
            $unwind:'$product'
           },
           {
            $project:{
                item:'$product.item',
                quantity:'$product.quantity'
            }

           },
           {
            $lookup:{
                from:collections.Product_Collecction,
                localField:'item',
                foreignField:'_id',
                as:'product'
            }
           },
           {
            $project:{
                item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
            }
           }
        ]).toArray()
        console.log(cartItems);
               
        resolve(cartItems)
        
        })

    },
    changeproductquantity:(prodetail)=>{
       prodetail.count=parseInt(prodetail.count)
       prodetail.quantity=parseInt(prodetail.quantity)
       
        return new Promise((resolve,reject)=>{
            if(prodetail.count==-1&& prodetail.quantity==1){
                db.get().collection(collections.CART_Collection).updateOne({_id:ObjectId(prodetail.cart)},
                {
                    $pull:{product:{item:ObjectId(prodetail.product)}}
                }
                ).then((response)=>{
                    resolve({removeproduct:true})

                })
            }else{
                db.get().collection(collections.CART_Collection).updateOne({_id:ObjectId(prodetail.cart),'product.item':ObjectId(prodetail.product)}, {$inc:{'product.$.quantity':prodetail.count} }
                    ).then((response)=>{
                        resolve(true)
                    }).catch(()=>{
                        reject()
                    })

            }
            

        })

    },
    removeproduct_cart:(cartdata)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.CART_Collection).updateOne({_id:ObjectId(cartdata.cart)},
            {
                $pull:{product:{item:ObjectId(cartdata.product)}}
            }
            ).then((response)=>{
                resolve(response)

            }).catch(()=>{
                reject()
            })

        })

        
    },
    gettotalamount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            totalprice=await db.get().collection(collections.CART_Collection ).aggregate([
            {
                $match:{user:ObjectId(userId)}


           },
           {
            $unwind:'$product'
           },
           {
            $project:{
                item:'$product.item',
                quantity:'$product.quantity'
            }

           },
           {
            $lookup:{
                from:collections.Product_Collecction,
                localField:'item',
                foreignField:'_id',
                as:'product'
            }
           },
           {
            $project:{
                item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
            }
           },
           {
            $group:{
                
                _id:null,totalprice:{$sum:{$multiply:[{ $toDouble: "$quantity" },
                { $toDouble: "$product.price" }]}}
            }
           }
        ]).toArray()

        console.log(totalprice);
        if (totalprice && totalprice.length > 0) {
            resolve(totalprice[0].totalprice)

        }else{
            resolve(0);
        }
            
        }).catch((error)=>{
            reject(error)

        })

    },
    
    getCartproductlist:(userId)=>{
        return new Promise((resolve,reject)=>{
            let cart=db.get().collection(collections.CART_Collection).findOne({user:ObjectId(userId)}).then((cart)=>{ 
            resolve(cart.product) 

            })
            
        })


    },
    placeorder:(order,product,total)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(order,product,total);
            let status=order['payment_method']==='COD'?'order placed':'order pending'
            let shippingStatus='orderd'
            let orderObj={
                deliveryDetails:{
                    Name:order.name,
                    phone:order.phonenumber,
                    address:order.Address,
                    city:order.city,
                    State:order.State,
                    Postcode:order.Postcode,
                    Country:order.country
                },
                userId:ObjectId(order.userId),
                paymentMethod:order['payment_method'],
                products:product,
                totaAmount:total,
                status:status,
                shippingStatus:shippingStatus,
                date:new Date()
            }
             placeorders=await db.get().collection(collections.ORDER_Collection).insertOne(orderObj).then((result)=>{

                db.get().collection(collections.CART_Collection).deleteOne({user:ObjectId(order.userId)})
                console.log(result);
                resolve(result.insertedId)

            }).catch(()=>{
                reject()
            })

        })
        

    },
    getorderdetails:(userId)=>{     
        return new Promise((resolve,reject)=>{
           let orders=db.get().collection(collections.ORDER_Collection).find({userId:ObjectId(userId)}).toArray()

            resolve(orders) 


          
            
        })

    },
    Cancelproduct_order:(Id,status)=>{
        console.log(status);
        if(status=='order placed'||status=='order pending'){
            status='cancel order'
        }
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.ORDER_Collection).updateOne({_id:ObjectId(Id)},{
                $set:{
                    status:status
                }
            }).then((response)=>{
                console.log(response);
                resolve(response)
            })
            

        })

    },
     findByNumber:(num)=> {
        return new Promise(async (resolve, reject) => {
          const user = await db.get().collection(collections.USER_Collection).findOne({ userphone: num });
          console.log(num);
          if (user) {
            if (user.isblocked) {
              reject({ err: 'This account is block' });
            } else {
              resolve(user);
            }
          } else {
            reject({ err: 'account not found' });
          }
        });
      },
      getAllorderproducts:(orderId)=>{
        console.log(orderId,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        return new Promise(async(resolve,reject)=>{
            let singleproduct=await db.get().collection(collections.ORDER_Collection).aggregate([
                {
                    $match:{_id:ObjectId(orderId)},

                },
                {
                    $project:{
                        products:1,
                        deliveryDetails:1,
                        
                    },
                },
                {
                    $unwind:'$products'
                },
                {
                    $lookup: {
                        from: 'productdata',
                        localField: 'products.item',
                        foreignField: '_id',
                        as:'orders'
                      },
                },
                {
                    $unwind:'$orders'
                },
            ]).toArray();
           
            resolve(singleproduct)
        });

    },

    product_wishlist:(proId,userId)=>{
        console.log(proId,userId);
        let proObj={
            item:ObjectId(proId),
        }
        return new Promise(async(resolve,reject)=>{
            let wishlist=await db.get().collection(collections.WISHLIST_Collection).findOne({user:ObjectId(userId)})

            if( wishlist){
                let proExist=wishlist.product.findIndex(product=>product.item==proId)
                console.log(proExist);
                if(proExist!=-1){
                    await  db.get().collection(collections.WISHLIST_Collection).updateOne({user:ObjectId(userId),'product.item':ObjectId(proId)},
                    {
                        $pull:{product:{item:ObjectId(proId)}}
                    }
                    ).then(()=>{
                        resolve()
                    }).catch(()=>{
                        reject()
                    })

                }else{
                    await  db.get().collection(collections.WISHLIST_Collection).updateOne({user:ObjectId(userId)},
                {
                    $push:{product:proObj}
                }
                ).then((response)=>{
                    resolve()
                })

                }
               

            }else{
                WishObj={
                    user:ObjectId(userId),
                    product:[proObj]
                }
              await  db.get().collection(collections.WISHLIST_Collection).insertOne(WishObj).then((response)=>{
                    resolve()
                })
            }
        })
        

    },
    get_productwishlist:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            wishlistItems=await db.get().collection(collections.WISHLIST_Collection ).aggregate([
            {
                $match:{user:ObjectId(userId)}


           },
           {
            $unwind:'$product'
           },
           {
            $project:{
                item:'$product.item',
               
            }

           },
           {
            $lookup:{
                from:collections.Product_Collecction,
                localField:'item',
                foreignField:'_id',
                as:'product'
            }
           },
           {
            $project:{
                item:1,product:{$arrayElemAt:['$product',0]}
            }
           }
        ]).toArray()
        console.log(wishlistItems);
               
        resolve(wishlistItems)
        
        })

    },
    get_userdata:(userId)=>{
        console.log(userId);
        return new Promise(async(resolve,reject)=>{
            let userdata=await db.get().collection(collections.USER_Collection).findOne({_id:ObjectId(userId)})
            console.log(userdata);
            resolve(userdata)
        })
    },
    generateRazorpay:(orderId,totalprice)=>{
        return new Promise(async(resolve,reject)=>{
            instance.orders.create({
                amount: totalprice*100,
                currency: "INR",
                receipt:""+ orderId,
                notes: {
                  key1: "value3",
                  key2: "value2"
                }
                
              },(err,order)=>{
                
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(order);
                      resolve(order);
                    }
            

              })
            
        })

    },
    verifyPayment:(details)=>{
        return new Promise(async(resolve,reject)=>{
            const {createHmac,} = await import('node:crypto');
            let hmac = createHmac('sha256', 'G6vMKKvkkG7mTw32cfp1ziP3' );
            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
            hmac=hmac.digest('hex') 
            if(hmac==details[ 'payment[razorpay_signature]']){
                resolve()
            }else{
                reject()
            }    

            
        })


    },
    changepaymentStatus:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.ORDER_Collection).updateOne({_id:ObjectId(orderId)},
            {
                $set:{
                    status:'order placed'
                }
            }
            ).then(()=>{
                resolve()
            })

            
        })
        

    },
    
     adduseraddress:(Address)=>{
        console.log(Address);
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.USER_Collection).updateOne({_id:ObjectId(Address.userId)},
            {
                $set:{
                   username:Address.name,
                   'Address':Address.Address,
                   'City':Address.city,
                   'State':Address.State,
                   'Postcode':Address.Postcode,
                   'phonenum':Address.phonenumber,
                   'companyname':Address.companyname,
                   'Addemail':Address.email,


                }
            }
            ).then(()=>{
                resolve()
            })

            
        })
        
    },
    GetUseraddress:(userId)=>{
        return new Promise((resolve,reject)=>{
             db.get().collection(collections.USER_Collection).findOne({_id:ObjectId(userId)}).then((userdata)=>{
            resolve(userdata)

            })
            
        })

    },
    changepassword:(userId,pass)=>{
        return new Promise(async(resolve,reject)=>{
         let newwpass=pass.password=await bcrypt.hash(pass.password,10)

            db.get().collection(collections.USER_Collection).updateOne({_id:ObjectId(userId)},
            {
                $set:{
                    pass:newwpass
                }
            }
            ).then(()=>{
                resolve()
            })

            
        })

    },
    getoffers:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.COUPON_Collection).find().toArray().then((response)=>{
           resolve(response)

           })
           
       })

    },
    couponmanagement:(code,total)=>{
        console.log(code);
        console.log(total);
        total = parseInt(total)
        return new Promise(async(resolve,reject)=>{
            const coupon = await db.get().collection(collections.COUPON_Collection).aggregate([
                {
                    $match: {
                      $and: [
                        { CouponCode: code },
                        { Maximum:{ $gte: total } },
                        { dateofexpired : { $gte: new Date() } },
                        { dateofpublish: { $lte: new Date() } }
                      ]
                    }
                  },
                  {
                    $project: {
                      _id: null,
                      offerAmount: {
                        $subtract: [
                          total,
                          {
                            $divide: [
                              { $multiply: [total, "$discount"] },
                              100
                            ]
                          }
                        ]
                      }
                    }
                  }
              
            ]).toArray()
            console.log(coupon,">>>>>>>>>>>>>>>>>>>>>");
            if(coupon.length !=0){
              resolve(coupon[0]?.offerAmount)
            }else{
              reject()
            }
            
          })

    },
    getsearchproduct:(value)=>{
        console.log(value,">>>>>>>>>>>>>>>>>>>>>>>>");
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.Product_Collecction).findOne({$text: {$search: value}}).then((productDATA)=>{
                    console.log(productDATA,"&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

                resolve(productDATA)

            })
        })
        

    },
    showproductshome:()=>{
        return new Promise(async(resolve,reject)=>{
            let showproduct=await db.get().collection(collections.Product_Collecction).find().limit(4).toArray()
            console.log(showproduct);
            resolve(showproduct)
        })

    },
    getPriceFilter: (min,max) => {
        console.log(min,max);
          return new Promise(async (resolve, reject) => {
            let priceFilter = await db.get().collection(collections.Product_Collecction).aggregate([
              {
                $match: {
                    price: { $gte: min, $lte: max}
                }
              },

            ]).toArray()
              console.log(priceFilter);
            resolve(priceFilter)
          })
        }
   
    
       
    









}
   
 

     
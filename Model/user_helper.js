var db=require('./Connection')
var collections=require('./Collection')
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')
const { response } = require('../app')
const { Product_Collecction } = require('./Collection')
const { promiseImpl } = require('ejs')
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
        return new Promise((resolve,reject)=>{
            console.log(order,product,total);
            let status=order['payment_method']==='COD'?'order placed':'order pending'
            let orderObj={
                deliveryDetails:{
                    Name:order.name,
                    phone:order.phone,
                    address:order.Address,
                    city:order.City,
                    State:order.State,
                    Postcode:order.Postcode,
                    Country:order.country
                },
                userId:ObjectId(order.userId),
                paymentMethod:order['payment_method'],
                products:product,
                totaAmount:total,
                status:status,
                date:new Date()
            }
            db.get().collection(collections.ORDER_Collection).insertOne(orderObj).then((response)=>{

                db.get().collection(collections.CART_Collection).deleteOne({user:ObjectId(order.userId)})



                resolve()

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
        

    }




}
   
 

     
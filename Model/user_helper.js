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
            if(user){
                
                reject({error:'Email allready exist'})
            }else{
                userinfo.pass=await bcrypt.hash(userinfo.pass,10)
            db.get().collection(collections.USER_Collection).insertOne(userinfo).then((user)=>{
                
                resolve(user)
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

    }




}
   
 

    
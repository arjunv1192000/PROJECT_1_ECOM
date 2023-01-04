var db=require('../Model/Connection')
var collections=require('../Model/Collection')
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')
module.exports={

    Adminlogin:(admininfo)=>{
        return new Promise(async(resolve,reject)=>{
            let admin=await db.get().collection(collections.Admin_Collecction).findOne({adminname:admininfo.adminname})
            if(admin){
                bcrypt.compare(admininfo.adminpassword,admin.adminpassword).then((status)=>{
                    if(status){
                        resolve( )
                    }else{
                        reject({error:"password"} )
                    }
                })

                
            }else{
                reject( {error:"username"})
            }
            
           

        })
        
        

    },
    GetAlluserdata:()=>{
        return new Promise(async(resolve,reject)=>{
            let userdata=await db.get().collection(collections.USER_Collection).find().toArray()
            console.log(userdata);
            resolve(userdata)
        })

    },
     adminadd(product){
        product.stock=true
        return new Promise(async(resolve,reject)=>{
            var item=await db.get().collection(collections.Product_Collecction).insertOne(product)
            let data={
                id:item.insertedId
            }
            if(item){
                resolve(data)
            }else{
                reject()
            }
        }).catch((err)=>{
            console.log(err);
        })
    },
    Getproductdata:()=>{
        return new Promise(async(resolve,reject)=>{
            let product=await db.get().collection(collections.Product_Collecction).find().toArray()
            let category=await db.get().collection(collections.category_Collecction).find().toArray()
            console.log(product,category);
            resolve(product,category)
        })

    },


    adminedit:(productid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.Product_Collecction).findOne({_id:ObjectId(productid)}).then((product)=>{

                resolve(product)
            })
        })
    },

    
    updateproduct:(Id,prodata)=>{
        return new Promise((resolve,reject)=>{
            console.log(Id);
            console.log(prodata,'>>>>>>>>>>>>>>>>>>>>>>>>>>');
            db.get().collection(collections.Product_Collecction).updateOne({_id:ObjectId(Id)},{$set:{
                productname:prodata.productname,
                size:prodata.size,
                Color:prodata.Color,
                description:prodata.description,
                category:prodata.category,
                dateofpublish:prodata.dateofpublish,
                price:prodata.price
                
            }}).then((response)=>{
                resolve()
            })
        })
    },
    deleteproduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.Product_Collecction).deleteOne({_id:ObjectId(proId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
            

        })
    },
    addcategory:(Catdata)=>{
        return new Promise(async(resolve,reject)=>{
            var category=await db.get().collection(collections.category_Collecction).insertOne(Catdata).then((category)=>{
                resolve(category)
            })
            
        })

    },
    gettcategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let catdatas=await db.get().collection(collections.category_Collecction).find().toArray()
            
            resolve(catdatas)
        })

    },
    updatecategory:(Id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.category_Collecction).findOne({_id:ObjectId(Id)}).then((data)=>{
                console.log(data);

                resolve(data)
            })
           
        })
    },


    editsubmit:(id,editdata)=>{
        return new Promise((resolve,reject)=>{
            console.log(id);
            console.log(editdata);
            db.get().collection(collections.category_Collecction).updateOne({_id:ObjectId(id)},{$set:{
                name:editdata.name,
            }}).then((response)=>{
                resolve()
            })
        })

    },
    deletecategory:(catID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.category_Collecction).deleteOne({_id:ObjectId(catID)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
            

        })

    },
    userblock:(useId,status)=>{
        if(status=='true'){
            status=false
        }else{
            status=true
        }
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_Collection).updateOne({_id:ObjectId(useId)},{
                $set:{
                    isblocked:status
                }
            }).then((response)=>{
                console.log(response);
                resolve(response)
            })
            

        })
        

    },Getcategorydata:()=>{
        return new Promise(async(resolve,reject)=>{
            let category=await db.get().collection(collections.category_Collecction).find().toArray()
            console.log(category);
            resolve(category)
        })

    },
    getAlluserorder:()=>{
        return new Promise(async(resolve,reject)=>{
            let Allorder=await db.get().collection(collections.ORDER_Collection).find().toArray()

            resolve(Allorder)
        })

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

    productstatus:(proId,stock)=>{
        console.log(proId,stock);
        if(stock=='true'){
            stock=false
        }else{
            stock=true
        }
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.Product_Collecction).updateOne({_id:ObjectId(proId)},{
                $set:{
                    stock:stock
                }
            }).then((response)=>{
                console.log(response);
                resolve(response)
            })
            

        })


    },
    Cancelproduct_orders:(Id,status)=>{
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
    addcoupons:(coupondata)=>{
        return new Promise(async(resolve,reject)=>{
            var category=await db.get().collection(collections.COUPON_Collection).insertOne(coupondata).then((response)=>{
                resolve(response)
            })
            
        })

    },
    Getcoupondata:()=>{
        return new Promise(async(resolve,reject)=>{
            let coupons=await db.get().collection(collections.COUPON_Collection).find().toArray()
            console.log(coupons);
            resolve(coupons)
        })
    },
    updatecoupon:(Id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.COUPON_Collection).findOne({_id:ObjectId(Id)}).then((data)=>{
                console.log(data);

                resolve(data)
            })
           
        })

    },
    couponupdate:(Id,editdata)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.COUPON_Collection).updateOne({_id:ObjectId(Id)},{$set:{
                CouponCode:editdata.CouponCode,
                CouponName:editdata.CouponName,
                discount:editdata.discount,
                dateofpublish:editdata.dateofpublish,
                dateofexpired:editdata.dateofexpired
        
            }}).then((response)=>{
                resolve()
            })
        })

    },
    deletecoupon:(ID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.COUPON_Collection).deleteOne({_id:ObjectId(ID)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
            

        })

    },
    getbannerTopage:()=>{
        return new Promise(async(resolve,reject)=>{
            let bannerdata=await db.get().collection(collections.BANNER_Collection).find().toArray()
            console.log(bannerdata);
            resolve(bannerdata)
        })
        


    },
    getttodaysale:()=>{
        const currentDate = new Date();
        return new Promise(async (resolve, reject) => {
            try {
                const order = await db.get().collection(collections.ORDER_Collection).aggregate([
                  {
                    $match: {
                      date: {
                        $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                        $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
                      }
                    }
                  },
                
                { $group: { _id: null, count: { $sum: 1 } } }
                ]).toArray();
               console.log(order);
                resolve(order[0].count);
              }catch (error) {
                console.error(error);
                reject(error);
              }
              
        });

    }
   




    

    }
    

    
    

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

    }
    




    

    }
    

    
    

var db=require('./Connection')
var collections=require('./Collection')
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')
module.exports={


    userSignup:(userinfo)=>{
        userinfo.isblocked=false
        return new Promise(async(resolve,reject)=>{
            

            let user=await db.get().collection(collections.USER_Collection).findOne({useremail:userinfo.useremail})
            if(user){
                
                reject({error:'Email allready exist'})
            }else{
                userinfo.pass=await bcrypt.hash(userinfo.pass,10)
            db.get().collection(collections.USER_Collection).insertOne(userinfo).then((data)=>{
                
                resolve(data)
            }).catch((error)=>{
                

                reject() 
            })

            }

        })   

    },


    Dologin:(userinfo)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collections.USER_Collection).findOne({useremail:userinfo.useremail})
            if(user){
                console.log(user);
                 if(user.isblocked){
                    reject({error:"user is blocked"})
                 }else{
                    bcrypt.compare(userinfo.pass,user.pass).then((status)=>{
                        if(status){
                            resolve()
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
       
            

    }




}
   


    
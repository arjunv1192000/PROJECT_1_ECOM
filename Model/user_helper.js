var db = require('./Connection')
require('dotenv').config();
var collections = require('./Collection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { response } = require('../app')
const { Product_Collecction } = require('./Collection')
const { promiseImpl } = require('ejs')
const Razorpay = require('razorpay');
const razorpaykey=process.env.RAZORPAY_KEY_ID;
const razorpaysecret=process.env.RAZORPAY_SECRET_ID;

var instance = new Razorpay({ key_id:razorpaykey , key_secret:razorpaysecret  })


module.exports = {


    userSignup: (userinfo) => {
        userinfo.isblocked = false
        return new Promise(async (resolve, reject) => {

            let user = await db.get().collection(collections.USER_Collection).findOne({ useremail: userinfo.useremail })
            console.log(user);
            if (user) {

                reject({ error: 'Email allready exist' })
            } else {
                userinfo.pass = await bcrypt.hash(userinfo.pass, 10)

                db.get().collection(collections.USER_Collection).insertOne(userinfo).then(() => {

                    resolve()


                }).catch((error) => {


                    reject(error)
                })

            }

        })

    },



    Dologin: (userinfo) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USER_Collection).findOne({ useremail: userinfo.useremail })
            console.log(user);
            if (user) {

                if (user.isblocked) {
                    reject({ error: "user is blocked" })
                } else {
                    bcrypt.compare(userinfo.pass, user.pass).then((status) => {
                        if (status) {
                            resolve(user)
                        } else {
                            reject({ error: "Invalid password" })
                        }

                    })

                }


            } else {
                reject({ error: "Invalid Email" })
            }


        })
    },
    showproducts: () => {
        return new Promise(async (resolve, reject) => {

            let showproduct = await db.get().collection(collections.Product_Collecction).find().toArray();
            console.log(showproduct);
            resolve(showproduct)
        })

    },
    productAlldetails:(prID) => {
        return new Promise(async(resolve, reject) => {
            await db.get().collection(collections.Product_Collecction).findOne({ _id: ObjectId(prID) }).then((productDATA) => {

                resolve(productDATA)
            })
        }).catch(()=>{
            reject()
        })



    },

    Getcategory: () => {
        return new Promise(async (resolve, reject) => {
            let catdatas = await db.get().collection(collections.category_Collecction).find().toArray()

            resolve(catdatas)
        }).catch((error) => {


            reject()
        })

    },
    filterBycategory: (procate) => {
        return new Promise(async (resolve, reject) => {
            let showproduct = await db.get().collection(collections.Product_Collecction).find({ category: procate.name }).toArray()

            resolve(showproduct)

        }).catch((error) => {


            reject()
        })

    },
    productcart: (proID, userId) => {
        let proObj = {
            item: ObjectId(proID),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let cartdata = await db.get().collection(collections.CART_Collection).findOne({ user: ObjectId(userId) })
            let product = await db.get().collection(collections.Product_Collecction).findOne({ _id: ObjectId(proID) })
            console.log(product.stocknumber);


            if (cartdata) {
                let proExist = cartdata.product.findIndex(product => product.item == proID)
                console.log(proExist);
                if (proExist != -1) {

                    if(product.stocknumber != cartdata.product[proExist].quantity){

                        await db.get().collection(collections.CART_Collection).updateOne({ user: ObjectId(userId), 'product.item': ObjectId(proID) }, { $inc: { 'product.$.quantity': 1 } }
                        ).then(() => {
                            resolve()
                        }).catch(() => {
                           return reject()
                        })

                    }else{
                        return reject()
                    }

                } else {
                    await db.get().collection(collections.CART_Collection).updateOne({ user: ObjectId(userId) },
                        {
                            $push: { product: proObj }
                        }
                    ).then((response) => {
                        resolve()
                    })

                }


            } else {
                cartObj = {
                    user: ObjectId(userId),
                    product: [proObj]
                }
                await db.get().collection(collections.CART_Collection).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })


    },
    Getcartproducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            cartItems = await db.get().collection(collections.CART_Collection).aggregate([
                {
                    $match: { user: ObjectId(userId) }


                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: '$product.quantity'
                    }

                },
                {
                    $lookup: {
                        from: collections.Product_Collecction,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]).toArray()
            console.log(cartItems);

            resolve(cartItems)

        })

    },
    changeproductquantity: (prodetail) => {
        prodetail.count = parseInt(prodetail.count)
        prodetail.quantity = parseInt(prodetail.quantity)

        return new Promise(async(resolve, reject) => {

            let stock= await db.get().collection(collections.Product_Collecction).findOne({_id:ObjectId(prodetail.product)})
                    console.log(stock.stocknumber);
                    stock=stock.stocknumber
                    if(stock<(prodetail.quantity + prodetail.count)){
                        console.log("entered reject");
                        return  reject()
                    }else{

                        if (prodetail.count == -1 && prodetail.quantity == 1) {
                            db.get().collection(collections.CART_Collection).updateOne({ _id: ObjectId(prodetail.cart) },
                                {
                                    $pull: { product: { item: ObjectId(prodetail.product) } }
                                }
                            ).then((response) => {
                                resolve({ removeproduct: true })
            
                            })
                        } else {
                            db.get().collection(collections.CART_Collection).updateOne({ _id: ObjectId(prodetail.cart), 'product.item': ObjectId(prodetail.product) }, { $inc: { 'product.$.quantity': prodetail.count } }
                            ).then((response) => {
                                resolve(true)
                            }).catch(() => {
                                reject()
                            })
            
                        }

                    }
           


        })

    },

    removeproduct_cart: (cartdata) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_Collection).updateOne({ _id: ObjectId(cartdata.cart) },
                {
                    $pull: { product: { item: ObjectId(cartdata.product) } }
                }
            ).then((response) => {
                resolve(response)

            }).catch(() => {
                reject()
            })

        })


    },
    gettotalamount: (userId) => {
        return new Promise(async (resolve, reject) => {
            totalprice = await db.get().collection(collections.CART_Collection).aggregate([
                {
                    $match: { user: ObjectId(userId) }


                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: '$product.quantity'
                    }

                },
                {
                    $lookup: {
                        from: collections.Product_Collecction,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $set: {
                      final: {
                        $switch: {
                          branches:
                          [{
                            case: { $and: ['$product.offerprice'] },
                            then: '$product.offerprice',
                          },
                          {
                            case: { $and: ['$product.catoffer'] },
                            then: '$product.catoffer',
                           
                          },
                          {
                            case: { $and: ['$product.price'] },
                            then: '$product.price',
                           
                          },
                          ],
                          default: '',
                        },
                      },
                    },
                  },
                {
                    $group: {

                        _id: null, totalprice: {
                            $sum: {
                                $multiply: [{ $toDouble: "$quantity" },
                                { $toDouble: "$final" }]
                            }
                        }
                    }
                }
            ]).toArray()

            console.log(totalprice);
            if (totalprice && totalprice.length > 0) {
                resolve(totalprice[0].totalprice)

            } else {
                resolve(0);
            }

        }).catch((error) => {
            reject(error)

        })

    },

    getCartproductlist: (userId) => {
        return new Promise((resolve, reject) => {
            let cart = db.get().collection(collections.CART_Collection).findOne({ user: ObjectId(userId) }).then((cart) => {
                resolve(cart.product)

            })

        })


    },
    placeorder: (order, product, total) => {
        return new Promise(async (resolve, reject) => {
            console.log(order, product, total);
            let status = order['payment_method'] === 'COD'||'wallet' ? 'Order placed' : 'Order pending'
            let shippingStatus = 'Orderd'
            let Return="pending"
            let orderObj = {
                deliveryDetails: {
                    Name: order.name,
                    phone: order.phonenumber,
                    address: order.Address,
                    city: order.city,
                    State: order.State,
                    Postcode: order.Postcode,
                    Country: order.country
                },
                userId: ObjectId(order.userId),
                paymentMethod: order['payment_method'],
                products: product,
                totaAmount:parseInt(total),
                status: status,
                shippingStatus: shippingStatus,
                date: new Date(),
                order_return:Return
            }
            placeorders = await db.get().collection(collections.ORDER_Collection).insertOne(orderObj).then((result) => {

                db.get().collection(collections.CART_Collection).deleteOne({ user: ObjectId(order.userId) })
                console.log(result);
                resolve(result.insertedId)

            }).catch(() => {
                reject()
            })

        })


    },
    removeCartAfterOrder:(items,userId)=>{
        return new Promise(async(resolve,reject)=>{
            for(let i=0;i<items.length;i++){
                items[i].quantity=Number(items[i].quantity)
                await db.get().collection(collections.Product_Collecction).updateOne({_id:items[i].prod},{$inc:{stocknumber:-items[i].quantity}})
                await db.get().collection(collections.Product_Collecction).updateOne({_id:items[i].prod},[{$set:{stock:{$cond:{if:{$lt:["$stocknumber",1]},then:false,else:true}}}}])
                db.get().collection(collections.CART_Collection).deleteOne({user:ObjectId(userId)}).then(()=>{
                    resolve()
                }).catch((error=>{
                    return reject()
                }))
            }
        })


    },
    getorderdetails: (userId) => {
        return new Promise((resolve, reject) => {
            let orders = db.get().collection(collections.ORDER_Collection).find({ userId: ObjectId(userId) }).toArray()

            resolve(orders)




        })

    },
    Cancelproduct_order: (Id, status) => {
        console.log(status);
        if (status == 'order placed' || status == 'order pending') {
            status = 'cancel order'
        }
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_Collection).updateOne({ _id: ObjectId(Id) }, {
                $set: {
                    status: status
                }
            }).then((response) => {
                console.log(response);
                resolve(response)
            })


        })

    },
    findByNumber: (num) => {
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
    getAllorderproducts: (orderId) => {
        console.log(orderId, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        return new Promise(async (resolve, reject) => {
            let singleproduct = await db.get().collection(collections.ORDER_Collection).aggregate([
                {
                    $match: { _id: ObjectId(orderId) },

                },
                {
                    $project: {
                        products: 1,
                        deliveryDetails: 1,

                    },
                },
                {
                    $unwind: '$products'
                },
                {
                    $lookup: {
                        from: 'productdata',
                        localField: 'products.item',
                        foreignField: '_id',
                        as: 'orders'
                    },
                },
                {
                    $unwind: '$orders'
                },
            ]).toArray();

            resolve(singleproduct)
        });

    },

    product_wishlist: (proId, userId) => {
        console.log(proId, userId);
        let proObj = {
            item: ObjectId(proId),
        }
        return new Promise(async (resolve, reject) => {
            let wishlist = await db.get().collection(collections.WISHLIST_Collection).findOne({ user: ObjectId(userId) })

            if (wishlist) {
                let proExist = wishlist.product.findIndex(product => product.item == proId)
                console.log(proExist);
                if (proExist != -1) {
                    await db.get().collection(collections.WISHLIST_Collection).updateOne({ user: ObjectId(userId), 'product.item': ObjectId(proId) },
                        {
                            $pull: { product: { item: ObjectId(proId) } }
                        }
                    ).then(() => {
                        resolve()
                    }).catch(() => {
                        reject()
                    })

                } else {
                    await db.get().collection(collections.WISHLIST_Collection).updateOne({ user: ObjectId(userId) },
                        {
                            $push: { product: proObj }
                        }
                    ).then((response) => {
                        resolve()
                    })

                }


            } else {
                WishObj = {
                    user: ObjectId(userId),
                    product: [proObj]
                }
                await db.get().collection(collections.WISHLIST_Collection).insertOne(WishObj).then((response) => {
                    resolve()
                })
            }
        })


    },
    get_productwishlist: (userId) => {
        return new Promise(async (resolve, reject) => {
            wishlistItems = await db.get().collection(collections.WISHLIST_Collection).aggregate([
                {
                    $match: { user: ObjectId(userId) }


                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',

                    }

                },
                {
                    $lookup: {
                        from: collections.Product_Collecction,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]).toArray()
            console.log(wishlistItems);

            resolve(wishlistItems)

        })

    },
    get_userdata: (userId) => {
        console.log(userId);
        return new Promise(async (resolve, reject) => {
            let userdata = await db.get().collection(collections.USER_Collection).findOne({ _id: ObjectId(userId) }).then((userdata)=>{
                resolve(userdata)

            })
           
        })
    },
    generateRazorpay: (orderId, totalprice) => {
        return new Promise(async (resolve, reject) => {
            instance.orders.create({
                amount: totalprice * 100,
                currency: "INR",
                receipt: "" + orderId,
                notes: {
                    key1: "value3",
                    key2: "value2"
                }

            }, (err, order) => {

                if (err) {
                    console.log(err);
                } else {
                    console.log(order);
                    resolve(order);
                }


            })

        })

    },
    verifyPayment: (details) => {
        return new Promise(async (resolve, reject) => {
            const { createHmac, } = await import('node:crypto');
            let hmac = createHmac('sha256', 'G6vMKKvkkG7mTw32cfp1ziP3');
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
            hmac = hmac.digest('hex')
            if (hmac == details['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject()
            }


        })


    },
    changepaymentStatus: (orderId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.ORDER_Collection).updateOne({ _id: ObjectId(orderId) },
                {
                    $set: {
                        status: 'order placed'
                    }
                }
            ).then(() => {
                resolve()
            })


        })


    },

    adduseraddress: (address) => {
        console.log(address);
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.USER_Collection).updateOne({ _id: ObjectId(address.userId) },
                {
                    $push: {
                        'Addresses': {
                            'addressId':ObjectId(),
                            'Address': address.Address,
                            'City': address.city,
                            'State': address.State,
                            'Postcode': address.Postcode,
                            'phonenum': address.phonenumber,
                            'companyname': address.companyname,
                            'Addemail': address.email,
                        }
                    }
                }
            ).then(() => {
                resolve()
            }).catch((error) => {
                reject(error)
            })
        })
    },


    GetUseraddress: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USER_Collection).findOne({ _id: ObjectId(userId) }).then((userdata) => {
                resolve(userdata)

            })

        })

    },
    changepassword: (userId, pass) => {
        return new Promise(async (resolve, reject) => {
            let newwpass = pass.password = await bcrypt.hash(pass.password, 10)

            db.get().collection(collections.USER_Collection).updateOne({ _id: ObjectId(userId) },
                {
                    $set: {
                        pass: newwpass
                    }
                }
            ).then(() => {
                resolve()
            })


        })

    },
    getoffers: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.COUPON_Collection).find().toArray().then((response) => {
                resolve(response)

            })

        })

    },
    couponmanagement: (code, total) => {
        console.log(code);
        console.log(total);
        total = parseInt(total)
        return new Promise(async (resolve, reject) => {
          const coupon = await db.get().collection(collections.COUPON_Collection).aggregate([
            {
              $match: {
                $and: [
                  { CouponCode: code },
                  { Maximum: { $gte: total } },
                  { dateofexpired: { $gte: new Date() } },
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
          console.log(coupon, ">>>>>>>>>>>>>>>>>>>>>");
          if (coupon.length != 0) {
            resolve(coupon[0]?.offerAmount)
          } else {
              return reject()
          }
        }).catch(()=>{
            return reject()
        })
      },
      
    
    getsearchproduct: (value) => {
        console.log(value, ">>>>>>>>>>>>>>>>>>>>>>>>");
        return new Promise((resolve, reject) => {
            let search = db.get().collection(collections.Product_Collecction).findOne({ $text: { $search: value } }).then((productDATA) => {
                if (search.length != 0) {
                    resolve(productDATA)

                } else {
                    reject()
                }


            })
        })


    },
    showproductshome: () => {
        return new Promise(async (resolve, reject) => {
            let showproduct = await db.get().collection(collections.Product_Collecction).find().limit(4).toArray()
            console.log(showproduct);
            resolve(showproduct)
        })

    },
    getPriceFilter: (min, max) => {
        console.log(`Filtering products by price between ${min} and ${max}...`);
        let minimum=parseInt(min)
        let maximum=parseInt(max)
        return new Promise(async (resolve, reject) => {
          try {
            const priceFilter = await db.get().collection(collections.Product_Collecction).aggregate([
              {
                $match: {
                  price: { $gte: minimum, $lte: maximum }
                }
              },
            ]).toArray();
            console.log(`Found ${priceFilter.length} products matching filter.`);
            if (priceFilter.length > 0) {
              resolve(priceFilter);
            } else {
              reject(new Error('No products found'));
            }
          } catch (error) {
            console.error('Error filtering products by price:', error);
            reject(new Error('Error filtering products by price'));
          }
        });
      },
    paginatorCount: (count) => {
        return new Promise((resolve, reject) => {
            if (count < 0) {
                reject(new Error("Count must be a positive number"));
            } else {
                let pages = Math.ceil(count / 8);
                let arr = [];
                for (let i = 1; i <= pages; i++) {
                    arr.push(i);
                }
                resolve(arr);
            }
        });
    },
    getTenProducts: (Pageno) => {
        return new Promise(async (resolve, reject) => {
            let val = (Pageno - 1) * 8
            let AllProducts_ = await db.get().collection(collections.Product_Collecction)
                .find().sort({ _id: -1 }).skip(val).limit(8).toArray()

            resolve(AllProducts_)
        })
    },

    getPricesort: () => {
        return new Promise(async (resolve, reject) => {
            let sort = await db.get().collection(collections.Product_Collecction).find().sort({ price: 1 }).toArray()
            console.log(sort);

            resolve(sort)
        })

    },
    getsortProducts:(Pageno)=>{
        return new Promise(async (resolve, reject) => {
            let val = (Pageno - 1) * 8
            let AllProducts_ = await db.get().collection(collections.Product_Collecction).find().sort({ _id: -1 }).sort({ price: 1 }).skip(val).limit(8).toArray()


            resolve(AllProducts_)
        })

    },

    getSingleorder: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_Collection).findOne({ _id: ObjectId(orderId) }).then((orderdata) => {
                resolve(orderdata)

            })

        })

    },
    Returnproduct_order: (Id, Return) => {
        console.log(Return);
        if (Return === 'pending') {
            Return = 'processing'
        }
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_Collection).updateOne({ _id: ObjectId(Id) }, {
                $set: {
                    order_return:Return

                }
            }).then((response) => {
                console.log(response);
                resolve(response)
            })


        })

    },
    getwalletAmount: (userId) => {
        return new Promise((resolve, reject) => {
          db.get().collection(collections.Wallet_collection).findOne({ userId: ObjectId(userId) }).then((walletdata) => {
            if (walletdata) {
              resolve(walletdata);
            } else {
                reject();
            }
          }).catch((error) => {
            reject(error);
          })
        })
      },
      
    changeThewalletamount:(userId,total)=>{
        console.log(userId,"wallet change");
        console.log(total,"?????????????????????????????????");
        return new Promise(async(resolve, reject) => {
            let wallet=await db.get().collection(collections.Wallet_collection).findOne({userId:ObjectId(userId)})
            console.log(wallet.Totalamount);
            console.log(total);

            if(wallet.Totalamount<total){
                console.log("reject working");

                return  reject()

            }else{
                db.get().collection(collections.Wallet_collection).updateOne({userId:ObjectId(userId)},[{$set:{Totalamount:{$subtract:["$Totalamount",parseInt(total)]}}}]).then(()=>{
                    resolve()
                })
            }
            

        })
        


    },
    WalletAmount:(userID)=>{
         
        return new Promise(async(resolve,reject)=>{

            let WalletAmount =await db.get().collection(collections.Wallet_collection).findOne({userId:ObjectId(userID)})

            console.log("walletAmount",WalletAmount);

            resolve(WalletAmount)
        })

    },

   













}




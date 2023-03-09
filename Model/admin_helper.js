var db = require('../Model/Connection')
var collections = require('../Model/Collection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
module.exports = {

    Adminlogin: (admininfo) => {
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection(collections.Admin_Collecction).findOne({ adminname: admininfo.adminname })
            if (admin) {
                bcrypt.compare(admininfo.adminpassword, admin.adminpassword).then((status) => {
                    if (status) {
                        resolve()
                    } else {
                        reject({ error: "password" })
                    }
                })


            } else {
                reject({ error: "username" })
            }



        })



    },
    GetAlluserdata: () => {
        return new Promise(async (resolve, reject) => {
            let userdata = await db.get().collection(collections.USER_Collection).find().toArray()
            console.log(userdata);
            resolve(userdata)
        })

    },
    adminadd(product) {
        product.stock = true
        return new Promise(async (resolve, reject) => {
            var item = await db.get().collection(collections.Product_Collecction).insertOne(product)
            let data = {
                id: item.insertedId
            }
            if (item) {
                resolve(data)
            } else {
                reject()
            }
        }).catch((err) => {
            console.log(err);
        })
    },
    Getproductdata: () => {
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collections.Product_Collecction).find().toArray()
            let category = await db.get().collection(collections.category_Collecction).find().toArray()
            console.log(product, category);
            resolve(product, category)
        })

    },


    adminedit: (productid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.Product_Collecction).findOne({ _id: ObjectId(productid) }).then((product) => {

                resolve(product)
            })
        })
    },


    updateproduct: (Id, prodata) => {
        return new Promise((resolve, reject) => {
            console.log(Id);
            console.log(prodata, '>>>>>>>>>>>>>>>>>>>>>>>>>>');
            db.get().collection(collections.Product_Collecction).updateOne({ _id: ObjectId(Id) }, {
                $set: {
                    productname: prodata.productname,
                    size: prodata.size,
                    Color: prodata.Color,
                    description: prodata.description,
                    category: prodata.category,
                    dateofpublish: prodata.dateofpublish,
                    price: prodata.price

                }
            }).then((response) => {
                resolve()
            })
        })
    },
    deleteproduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.Product_Collecction).deleteOne({ _id: ObjectId(proId) }).then((response) => {
                console.log(response);
                resolve(response)
            })


        })
    },
    addcategory: (Catdata) => {
        return new Promise(async (resolve, reject) => {
            var category = await db.get().collection(collections.category_Collecction).insertOne(Catdata).then((category) => {
                resolve(category)
            })

        })

    },
    gettcategory: () => {
        return new Promise(async (resolve, reject) => {
            let catdatas = await db.get().collection(collections.category_Collecction).find().toArray()

            resolve(catdatas)
        })

    },
    updatecategory: (Id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.category_Collecction).findOne({ _id: ObjectId(Id) }).then((data) => {
                console.log(data);

                resolve(data)
            })

        })
    },


    editsubmit: (id, editdata) => {
        return new Promise((resolve, reject) => {
            console.log(id);
            console.log(editdata);
            db.get().collection(collections.category_Collecction).updateOne({ _id: ObjectId(id) }, {
                $set: {
                    name: editdata.name,
                }
            }).then((response) => {
                resolve()
            })
        })

    },
    deletecategory: (catID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.category_Collecction).deleteOne({ _id: ObjectId(catID) }).then((response) => {
                console.log(response);
                resolve(response)
            })


        })

    },
    userblock: (useId, status) => {
        if (status == 'true') {
            status = false
        } else {
            status = true
        }
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USER_Collection).updateOne({ _id: ObjectId(useId) }, {
                $set: {
                    isblocked: status
                }
            }).then((response) => {
                console.log(response);
                resolve(response)
            })


        })


    }, Getcategorydata: () => {
        return new Promise(async (resolve, reject) => {
            let category = await db.get().collection(collections.category_Collecction).find().toArray()
            console.log(category);
            resolve(category)
        })

    },
    getAlluserorder: () => {
        return new Promise(async (resolve, reject) => {
            let Allorder = await db.get().collection(collections.ORDER_Collection).find().sort({ date: -1 }).toArray()

            resolve(Allorder)
        })

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

    productstatus: (proId, stock) => {
        console.log(proId, stock);
        if (stock == 'true') {
            stock = false
        } else {
            stock = true
        }
        return new Promise((resolve, reject) => {
            db.get().collection(collections.Product_Collecction).updateOne({ _id: ObjectId(proId) }, {
                $set: {
                    stock: stock
                }
            }).then((response) => {
                console.log(response);
                resolve(response)
            })


        })


    },
    Cancelproduct_orders: (Id, status) => {
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
    addcoupons: (coupondata) => {
        coupondata.dateofpublish = new Date(coupondata.dateofpublish)
        coupondata.dateofexpired = new Date(coupondata.dateofexpired)
        return new Promise(async (resolve, reject) => {
            var category = await db.get().collection(collections.COUPON_Collection).insertOne(coupondata).then((response) => {
                resolve(response)
            })

        })

    },
    Getcoupondata: () => {
        return new Promise(async (resolve, reject) => {
            let coupons = await db.get().collection(collections.COUPON_Collection).find().toArray()
            console.log(coupons);
            resolve(coupons)
        })
    },
    updatecoupon: (Id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.COUPON_Collection).findOne({ _id: ObjectId(Id) }).then((data) => {
                console.log(data);

                resolve(data)
            })

        })

    },
    couponupdate: (Id, editdata) => {
        editdata.dateofpublish = new Date(editdata.dateofpublish)
        editdata.dateofexpired = new Date(editdata.dateofexpired)
        editdata.minimum = parseInt(editdata.minimum)
        editdata.Maximum = parseInt(editdata.Maximum)
        editdata.discount = parseInt(editdata.discount)

        return new Promise((resolve, reject) => {
            db.get().collection(collections.COUPON_Collection).updateOne({ _id: ObjectId(Id) }, {
                $set: {
                    CouponCode: editdata.CouponCode,
                    CouponName: editdata.CouponName,
                    discount: editdata.discount,
                    dateofpublish: editdata.dateofpublish,
                    dateofexpired: editdata.dateofexpired,
                    minimum: editdata.minimum,
                    Maximum: editdata.Maximum

                }
            }).then((response) => {
                resolve()
            })
        })

    },
    deletecoupon: (ID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.COUPON_Collection).deleteOne({ _id: ObjectId(ID) }).then((response) => {
                console.log(response);
                resolve(response)
            })


        })

    },
    getbannerTopage: () => {
        return new Promise(async (resolve, reject) => {
            let bannerdata = await db.get().collection(collections.BANNER_Collection).find().toArray()
            console.log(bannerdata);
            resolve(bannerdata)
        })



    },
    TotalSales: () => {

        return new Promise(async (resolve, reject) => {

            let TotalSales = await db.get().collection(collections.ORDER_Collection).aggregate([

                { $group: { _id: null, count: { $sum: 1 } } }

            ]).toArray()

            resolve(TotalSales[0].count)

        })
    },
    TodayOrders: () => {
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
                console.log(order, "todayorder");
                if (order.length > 0) {
                    resolve(order[0].count);
                } else {
                    resolve(0);
                }
            } catch (error) {
                console.error(error);
                reject(error);
            }

        });
    },
    ThisWeekOrders: () => {

        return new Promise(async (resolve, reject) => {
            const Weekorders = await db.get().collection(collections.ORDER_Collection)
                .find({
                    $and: [
                        { date: { $lte: new Date() } },
                        { date: { $gte: new Date(new Date().getDate() - 7) } },

                    ],
                }).toArray();
            const count = Object.values(Weekorders).length;
            console.log(count, "Weekorder");
            resolve(count);
        });
    },
    ThisMonthOrders: () => {

        return new Promise(async (resolve, reject) => {
            const Monthorders = await db.get().collection(collections.ORDER_Collection)
                .find({
                    $and: [       
                        { date: { $lte: new Date() } },
                        { date: { $gte: new Date(new Date().getDate() - 30) } },

                    ],
                }).toArray();
            const count = Object.values(Monthorders).length;
            console.log(count, "Monthorders");
            resolve(count);
        });


    },
    ThisYearOrders: () => {
        const currentDate = new Date();
        return new Promise(async (resolve, reject) => {
            const currentDate = new Date();
            const nextYear = new Date(currentDate.getFullYear() + 1, 0, 1);

            const yearOrderCount = await db.get().collection(collections.ORDER_Collection).aggregate([
                {
                    $match: {
                        date: {
                            $gte: new Date(currentDate.getFullYear(), -365),
                            $lt: nextYear
                        }
                    }
                },
                { $group: { _id: null, count: { $sum: 1 } } }
            ]).toArray();

            console.log(yearOrderCount);
            resolve(yearOrderCount[0].count)

        });
    },
    TodayRevenue: () => {
        const currentDate = new Date();
        return new Promise(async (resolve, reject) => {
            try {
                const TodayRevenue = await db.get().collection(collections.ORDER_Collection).aggregate([
                    {
                        $match: {
                            shippingStatus: 'delivered',
                            date: {
                                $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                                $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+ 1)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$totaAmount' },
                        },
                    },
                ]).toArray();
                console.log(TodayRevenue, "TODAY");
                if (TodayRevenue.length > 0) {
                    resolve(TodayRevenue[0].total);
                } else {
                    resolve(0)
                }
            } catch (error) {
                console.error(error);
                reject(error);
            }

        });
    },

    totalRevenue: () => {
        return new Promise(async (resolve, reject) => {
            const sales = await db.get().collection(collections.ORDER_Collection).aggregate([
                {
                    $match: { shippingStatus: 'delivered' }

                },
                {
                    $group: { _id: null, total: { $sum: '$totaAmount' } },
                },
            ]).toArray();
            if (sales.length > 0) {
                console.log(sales, "totalR");
                resolve(sales[0].total);

            } else {

                resolve(0);
            }
        });


    },
    weekRevenue: () => {
        return new Promise(async (resolve, reject) => {
            const Weeksales = await db.get().collection(collections.ORDER_Collection).aggregate([
                {
                    $match: { shippingStatus: 'delivered', date: { $gte: new Date(new Date().getDate() - 7) } },
                },
                {
                    $group: { _id: null, total: { $sum: '$totaAmount' } },
                },
            ]).toArray();
            if (Weeksales.length !== 0) {
                console.log(Weeksales, "WEEKr");
                resolve(Weeksales[0].total);
            } else {
                resolve(0);
            }
        });
    },
    yearRevenue: () => {
        const currentDate = new Date();
        return new Promise(async (resolve, reject) => {
            const currentDate = new Date();
            const nextYear = new Date(currentDate.getFullYear() + 1, 0, 1);

            const YearRevenue = await db.get().collection(collections.ORDER_Collection).aggregate([
                {
                    $match: {
                        shippingStatus: 'delivered',
                        date: {
                            $gte: new Date(currentDate.getFullYear(), -365),
                            $lt: nextYear
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totaAmount' },
                    },
                }
            ]).toArray();

            console.log(YearRevenue, "yearR");
            if (YearRevenue.length > 0 && YearRevenue[0]) {
                resolve(YearRevenue[0].total)
            } else {
                resolve(0)
            }

        });
    },
    totaluser: () => {
        return new Promise(async (resolve, reject) => {
            const users = await db.get().collection(collections.USER_Collection).find().toArray();
            resolve(users);
        });

    },
    // monthRevenue: () => {
    //     return new Promise(async (resolve, reject) => {

    //         const currentDate= new Date();
    //         // const newDate = currentDate.getDate();
    //         const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    //         const monthEnd = new Date(new Date().getDate() - 30);

    //         const monthRevenue = await db.get().collection(collections.ORDER_Collection).aggregate([
    //             {
    //                 $match: {
    //                     date: {
    //                         $gte: monthStart,
    //                         $lt: monthEnd
    //                     }
    //                 }
    //             },
    //             {
    //                 $group: {
    //                     _id: null,
    //                     total: { $sum: '$totalAmount' },
    //                 }
    //             }
    //         ]).toArray();

    //         console.log(monthRevenue[0].total, "monthR");
    //         if (monthRevenue.length > 0 && monthRevenue[0]) {
    //             resolve(monthRevenue[0].total)
    //         } else {
    //             resolve(0)
    //         }


    //     });


    // },
    chartcount: () => {
        return new Promise(async (resolve, reject) => {
            let data = {}
            data.ONLINE = await db.get().collection(collections.ORDER_Collection).find({ paymentMethod: "ONLINE" }).count()
            data.COD = await db.get().collection(collections.ORDER_Collection).find({ paymentMethod: "COD" }).count()
            data.PAYPAL = await db.get().collection(collections.ORDER_Collection).find({ paymentMethod: "paypal" }).count()
            data.RAZORPAY = await db.get().collection(collections.ORDER_Collection).find({ paymentMethod: "Razorpay" }).count()
            data.PLACED = await db.get().collection(collections.ORDER_Collection).find({ status: "placed" }).count()
            data.CANCEL = await db.get().collection(collections.ORDER_Collection).find({ status: "cancel order" }).count()
            data.PENDING = await db.get().collection(collections.ORDER_Collection).find({ status: "order pending" }).count()
            data.DELIVERED = await db.get().collection(collections.ORDER_Collection).find({ shippingStatus: "delivered" }).count()

            console.log(data, "chart)))))))))))))))))))))))))))))))))))");

            resolve(data)


        })

    },
    allSalesreport: () => {
        return new Promise(async (resolve, reject) => {
            let salesReport = await db.get().collection(collections.ORDER_Collection).aggregate([
                {
                    $match: { shippingStatus: "delivered" }
                },
                {
                    $unwind: '$products'
                },



            ]).toArray()
            console.log(salesReport, "))))))))))))))))))))))))))))");
            resolve(salesReport)

        })
    },
    updateshippingstatus: (Id, shipping) => {
        if (shipping == 'Orderd') {
            shipping = 'delivered'
        }
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_Collection).updateOne({ _id: ObjectId(Id) }, {
                $set: {
                    shippingStatus: shipping
                }
            }).then((response) => {
                console.log(response);
                resolve(response)
            })


        })

    },
    addprooffer: (prooff) => {
        prooff.dateofexpired = new Date(prooff.dateofexpired)
        prooff.proDiscount = parseInt(prooff.proDiscount)
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.ProOffer_Collection).insertOne(prooff)
            resolve()
        })




    },
    Makediscount: (prodata) => {
        console.log(prodata);
        let proId = prodata.proId;
        prodata.proDiscount = parseInt(prodata.proDiscount)
        let discount = prodata.proDiscount
        return new Promise(async (resolve, reject) => {
           
            var offers = await db.get().collection(collections.Product_Collecction).aggregate([
                {
                    $match: { _id: ObjectId(proId) }
                },
                {
                    $project: { price: 1 }
                },

                {
                    $addFields: {
                        offer: { $subtract: ['$price', { $divide: [{ $multiply: ['$price', discount] }, 100] }] }

                    }
                }
            ]).toArray()

            console.log(offers);
            db.get().collection(collections.Product_Collecction).updateOne({ _id: ObjectId(proId) }, {
                $set: {
                    offerprice: offers[0].offer
                }
            }).then((response) => {
                console.log(response);
                resolve(response)
            })

        })


    },
    getproductoffer: () => {
        return new Promise(async (resolve, reject) => {
            let coupons = await db.get().collection(collections.ProOffer_Collection).find().toArray()
            console.log(coupons);
            resolve(coupons)
        })

    },
    addcatoffer:(catoffer)=>{
        catoffer.dateofexpired = new Date(catoffer.dateofexpired)
        catoffer.proDiscount = parseInt(catoffer.proDiscount)
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.catOffer_Collection).insertOne(catoffer)
            resolve()
        })


    },
    MakediscountonCat:(catdata)=>{
        let catname = catdata.category;
        catdata.proDiscount = parseInt(catdata.proDiscount)
        let discount = catdata.proDiscount
        return new Promise(async (resolve, reject) => {
           
            var offers = await db.get().collection(collections.Product_Collecction).aggregate([
                {
                    $match: { category: catname}
                },
                {
                    $project: { price: 1 }
                },

                {
                    $addFields: {
                        offer: { $subtract: ['$price', { $divide: [{ $multiply: ['$price', discount] }, 100] }] }

                    }
                }
                
            ]).toArray()
            console.log(offers);
           offers.forEach(element => {
                db.get().collection(collections.Product_Collecction).updateMany({_id:element._id},{
                $set:{
                  catoffer:element.offer
                }
              })
        
              });
        })

    }







}











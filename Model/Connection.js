
const  mongoClient  = require("mongodb").MongoClient
const state={
    db:null
}

module.exports.connect=function(done){
    const url="mongodb+srv://arjun:yGE6AlIUqvefgj5A@cluster0.1pk2z1h.mongodb.net/?retryWrites=true&w=majority"
    const dbname='project_ecom'

    mongoClient.connect(url,(err,data)=>{
        if(err)return done(err)
        state.db=data.db(dbname)
    done()

    })
}

module.exports.get=function(){
    return state.db
} 
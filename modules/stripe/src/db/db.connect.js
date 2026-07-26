require("dotenv").config()
const mongoose = require("mongoose")

async function ConnectDB(){ 

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database is Connected')
    }
    catch (error) {
        console.error("Database is Not Conntected, Error is Occured",error)
    }
}

module.exports=ConnectDB
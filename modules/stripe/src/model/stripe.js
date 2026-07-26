const mongoose = require("mongoose")

const StripeSchema = new mongoose.Schema({

merchantId:{
    type: mongoose.Schema.Types.ObjectId,
        ref: "merchants",
},

secretKey:{
    type:String,
    required:true
},

publishableKey:{
    type:String,
    required:true
},

webhookSecret:{
    type:String,
    required:true
},

mode:{
    type:String,
    required:true
}


})

const StripeModel = mongoose.model("stripe", StripeSchema)

module.exports = StripeModel
const mongoose = require("mongoose")

const AuthSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "merchant"],
        default: "user",
    }
})


const AuthModel = mongoose.model("Users", AuthSchema)

module.exports = AuthModel

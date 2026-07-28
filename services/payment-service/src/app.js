const express = require("express")
const routes = require("./routes/payment.routes")
const cookieParser = require("cookie-parser")

const app=express()

app.use(express.json())
app.use(cookieParser())


app.use("/payment", routes)


module.exports = app
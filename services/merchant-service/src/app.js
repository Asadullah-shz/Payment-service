const express = require("express")
const routes = require("./routes/merchant.routes")
const cookieParser = require("cookie-parser")

const app=express()

app.use(express.json())
app.use(cookieParser())


app.use("/merchant", routes)


module.exports = app
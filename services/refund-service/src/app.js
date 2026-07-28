const express = require("express")
const routes = require("./routes/refund.routes")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/refund", routes)


module.exports = app
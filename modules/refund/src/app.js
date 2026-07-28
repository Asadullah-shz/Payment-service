const express = require("express")
const routes = require("./routes/webhook.routes")
const cookieParser = require("cookie-parser")

const app = express()

app.use("/webhook", routes)
app.use(express.json())
app.use(cookieParser())


module.exports = app
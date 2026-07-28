const express = require("express")
const routes = require("./routes/Transaction.routes")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cookieParser())


app.use("/transaction", routes)


module.exports = app
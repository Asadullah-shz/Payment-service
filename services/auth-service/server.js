require("dotenv").config()
const app = require("./src/app")
const Database = require("./src/db/db.connect")
const dns = require(`dns`)
dns.setServers(["1.1.1.1", "8.8.8.8"])

Database()




const PORT = process.env.PORT
app.listen(PORT, () => {

    console.log("Auth Service is Running At Port", PORT)
})
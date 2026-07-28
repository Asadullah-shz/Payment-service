require("dotenv").config()
const app = require("./src/app")
const Database = require("./src/db/db.connect")
const { initializeRefundRPC } = require('./src/refund.rpc')
const dns = require(`dns`)
dns.setServers(["1.1.1.1", "8.8.8.8"])

Database()

initializeRefundRPC().catch(err => {
    console.error("Failed to start Refund RPC responders:", err);
});

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Refund Service is Running At Port", PORT)
})
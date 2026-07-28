require("dotenv").config()
const app = require("./src/app")
const Database = require("./src/db/db.connect")
const { initializeMerchantRPC } = require('./src/merchant.rpc')
const dns = require(`dns`)
dns.setServers(["1.1.1.1", "8.8.8.8"])

Database()

initializeMerchantRPC().catch(err => {
    console.error("Failed to start Merchant RPC responders:", err);
});

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Merchant Service is Running At Port", PORT)
})
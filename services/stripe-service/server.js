require("dotenv").config()
const app = require("./src/app")
const Database = require("./src/db/db.connect")
const { initializeStripeRPC } = require('./src/stripe.rpc')
const dns = require(`dns`)
dns.setServers(["1.1.1.1", "8.8.8.8"])

Database()

initializeStripeRPC().catch(err => {
    console.error("Failed to start Stripe RPC responders:", err);
});

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Stripe Service is Running At Port", PORT)
})
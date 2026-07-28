require("dotenv").config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { initializeGatewayRouterRPC } = require('./src/gatewayRouter.rpc');
const dns = require(`dns`)
dns.setServers(["1.1.1.1", "8.8.8.8"])
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

async function bootstrap() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('[GatewayRouter] Database Connected');

        await initializeGatewayRouterRPC();

        app.listen(PORT, () => {
            console.log(`[GatewayRouter] Service is Running At Port ${PORT}`);
        });
    } catch (error) {
        console.error('[GatewayRouter] Bootstrap Error:', error);
        process.exit(1);
    }
}

bootstrap();

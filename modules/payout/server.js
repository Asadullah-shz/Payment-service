require("dotenv").config()
const app = require("./src/app")
const mongoose = require('mongoose');
const dns = require(`dns`);
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

async function bootstrap() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('[Payout] Database Connected');

        app.listen(PORT, () => {
            console.log(`[Payout] Service is Running At Port ${PORT}`);
        });
    } catch (error) {
        console.error('[Payout] Bootstrap Error:', error);
        process.exit(1);
    }
}

bootstrap();

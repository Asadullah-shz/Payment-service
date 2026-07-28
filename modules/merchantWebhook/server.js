require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const MerchantWebhookService = require('./src/service/merchantWebhook.service');

const PORT = process.env.PORT || 14000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://panaw29744_db_user:4vPa2C4Kwofs3xG9@paymentservicedb.nub6dm1.mongodb.net/Payments';

async function bootstrap() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('[MerchantWebhook] Database is Connected');

       
        await MerchantWebhookService.startConsumer();
        console.log('[MerchantWebhook] RabbitMQ Consumer Started');

        app.listen(PORT, () => {
            console.log(`[MerchantWebhook] Service is Running At Port ${PORT}`);
        });
    } catch (error) {
        console.error('[MerchantWebhook] Bootstrap Error:', error);
        process.exit(1);
    }
}

bootstrap();

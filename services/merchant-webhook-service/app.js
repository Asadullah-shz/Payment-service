const express = require('express');
const cors = require('cors');
const merchantWebhookRoutes = require('./src/routes/merchantWebhook.routes');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/webhook-endpoints', merchantWebhookRoutes);


app.use((err, req, res, next) => {
    console.error('[MerchantWebhook] Unhandled Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;

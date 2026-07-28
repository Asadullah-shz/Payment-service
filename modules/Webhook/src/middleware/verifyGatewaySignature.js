const GatewayFactory = require('../../../gateway/gateway.factory');
const axios = require('axios');

const verifyGatewaySignature = async (req, res, next) => {
    const { merchantId } = req.params;
  
    if (!merchantId) {
        return res.status(400).send('Missing merchantId in webhook URL');
    }
  
    let preferredGateway = 'stripe';
    try {
        const merchantResponse = await axios.get(`http://localhost:5000/merchant/${merchantId}`);
        const merchant = merchantResponse.data.merchant;
        preferredGateway = merchant?.preferredGateway || 'stripe';
    } catch (error) {
        console.error("Warning: Could not fetch merchant details for webhook, defaulting to stripe.", error.message);
    }
    
    try {
        const gateway = GatewayFactory.get(preferredGateway);
  
        const event = await gateway.verifyWebhook(req, merchantId);
      
        req.gatewayEvent = event;
        req.merchantId = merchantId;
        next();
    } catch (err) {
        console.error(`[Webhook Middleware Error]: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

module.exports = verifyGatewaySignature;
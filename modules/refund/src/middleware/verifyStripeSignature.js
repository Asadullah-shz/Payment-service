const axios = require('axios');
const Stripe = require('stripe');

const STRIPE_SERVICE_URL = process.env.STRIPE_SERVICE_URL || 'http://localhost:7000/stripe';


const verifyStripeSignature = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const { merchantId } = req.params;

  if (!merchantId) {
      return res.status(400).send('Missing merchantId in webhook URL');
  }

 
  try {
    
    const stripeResponse = await axios.get(`${STRIPE_SERVICE_URL}/getconfig/${merchantId}`);
    const merchantStripeConfig = stripeResponse.data.result;

   
    if (!merchantStripeConfig || !merchantStripeConfig.secretKey || !merchantStripeConfig.webhookSecret) {
        console.error(`[Webhook Middleware] Missing secretKey or webhookSecret for merchant: ${merchantId}`);
        return res.status(400).send(`Configuration missing for merchant`);
    }

 
    const stripe = Stripe(merchantStripeConfig.secretKey);
    const endpointSecret = merchantStripeConfig.webhookSecret;

  
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    
  
    req.stripeEvent = event;
    req.merchantId = merchantId;
    next();
  } catch (err) {
   
    if (err.response) {
      console.error(`[Webhook Middleware] Stripe Config Fetch Error:`, err.response.data);
      return res.status(400).send(`Error fetching merchant config`);
    }

  
    console.error(`[Webhook Middleware Error]: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = verifyStripeSignature;
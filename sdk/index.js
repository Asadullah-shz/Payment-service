const HTTPClient = require('./client');
const Payment = require('./payment');
const Refund = require('./refund');
const Subscription = require('./subscription');
const Payout = require('./payout');
const Merchant = require('./merchant');
const Webhook = require('./webhook');
const errors = require('./errors');
const utils = require('./utils');

class PaymentSDK {
   
    constructor(config) {
        this.client = new HTTPClient(config);
        
       
        this.payment = new Payment(this.client);
        this.refund = new Refund(this.client);
        this.subscription = new Subscription(this.client);
        this.payout = new Payout(this.client);
        this.merchant = new Merchant(this.client);
        this.webhook = new Webhook(this.client);
    }
}


Object.assign(PaymentSDK, errors);

PaymentSDK.utils = utils;

module.exports = PaymentSDK;

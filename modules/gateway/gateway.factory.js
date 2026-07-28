const StripeGateway = require('./stripe/stripe.gateway');
const PaypalGateway = require('./paypal/paypal.gateway');
const JazzCashGateway = require('./jazzcash/jazzcash.gateway');
const EasyPaisaGateway = require('./easypaisa/easypaisa.gateway');

class GatewayFactory {
    
    static get(gatewayName) {
        if (!gatewayName) {
            gatewayName = 'stripe'; 
        }

        switch (gatewayName.toLowerCase()) {
            case 'stripe':
                return new StripeGateway();
            case 'paypal':
                return new PaypalGateway();
            case 'jazzcash':
                return new JazzCashGateway();
            case 'easypaisa':
                return new EasyPaisaGateway();
            default:
                throw new Error(`Unsupported Gateway: ${gatewayName}`);
        }
    }
}

module.exports = GatewayFactory;
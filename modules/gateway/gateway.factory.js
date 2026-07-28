const StripeGateway = require('./stripe/stripe.gateway');

class GatewayFactory {
    
    static get(gatewayName) {
        if (!gatewayName) {
            gatewayName = 'stripe'; 
        }

        switch (gatewayName.toLowerCase()) {
            case 'stripe':
                return new StripeGateway();
            // case 'paypal':
            //     return new PaypalGateway();
            default:
                throw new Error(`Unsupported Gateway: ${gatewayName}`);
        }
    }
}

module.exports = GatewayFactory;
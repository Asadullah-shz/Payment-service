
class GatewayInterface {
    
 
    async createPayment(params) {
        throw new Error("Method 'createPayment()' must be implemented.");
    }

    async retrievePayment(id, merchantId) {
        throw new Error("Method 'retrievePayment()' must be implemented.");
    }

 
   
    async cancelPayment(id, merchantId) {
        throw new Error("Method 'cancelPayment()' must be implemented.");
    }

   
    async refundPayment(params) {
        throw new Error("Method 'refundPayment()' must be implemented.");
    }

   
    async verifyWebhook(req, merchantId) {
        throw new Error("Method 'verifyWebhook()' must be implemented.");
    }

   
    async createCustomer(params) {
        throw new Error("Method 'createCustomer()' must be implemented.");
    }
}

module.exports = GatewayInterface;
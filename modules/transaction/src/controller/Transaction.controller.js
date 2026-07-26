const TransactionModel = require("../model/Transaction")



//  let merchantStripeConfig;
//         try {
//             console.log(`Making request to Stripe Service for merchant: ${merchantId}`);
//             const stripeResponse = await axios.get(`http://localhost:7000/stripe/getconfig/${merchantId}`);
//             merchantStripeConfig = stripeResponse.data.result;
//             console.log("Successfully fetched from Stripe Service:", merchantStripeConfig);
//         } catch (error) {
//             if (error.response) {

//                 console.error("Stripe Service returned an error status:", error.response.status);
//                 console.error("Stripe Service error data:", error.response.data);
//                 return res.status(error.response.status).json({
//                     message: "Error from Stripe Microservice",
//                     details: error.response.data
//                 });
//             } else if (error.request) {

//                 console.error("No response received from Stripe Service. Is it running on port 7000?", error.message);
//                 return res.status(503).json({ message: "Stripe Microservice is unreachable" });
//             } else {
//                 console.error("Axios request setup error:", error.message);
//                 return res.status(500).json({ message: "Internal Server Error setting up Axios" });
//             }
//         }
    

module.exports = { StripeRegister, UpdateStripe, GetMerchantconfigbyID }
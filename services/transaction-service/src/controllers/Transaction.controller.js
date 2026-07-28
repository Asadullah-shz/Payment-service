const TransactionModel = require('../models/Transaction')
const axios = require("axios")


async function Transactions(req, res) {

    try {
        let dbQuery = {};
        let entityId = null;

        
        if (req.user && req.user.role === 'merchant') {
            dbQuery.merchantId = req.user.id;
            entityId = req.user.id;
        } else {
            return res.status(401).json({ message: "Unauthorized: Only merchants can perform this action" });
        }

        let transactions = await TransactionModel.find(dbQuery).limit(10);

        if (transactions.length > 0) {
            return res.status(200).json({
                message: 'Transactions Successfully Fetched from Local Database',
                result: transactions
            });
        }


        console.log(`No local transactions found for ${entityId}. Fetching from Payment Service...`);
        let paymentsData = [];

        try {
            const paymentResponse = await axios.get(`http://localhost:9000/payment/record`, {
                headers: {
                    Authorization: req.headers.authorization,
                    Cookie: `token=${req.cookies.token}`
                }
            });
            paymentsData = paymentResponse.data.payments;
            console.log(`Successfully fetched ${paymentsData.length} records from Payment Service`);

        } catch (error) {
            console.error("Error fetching from Payment Service:", error.message);
            return res.status(500).json({ message: "Failed to fetch records from Payment Service" });
        }


        if (paymentsData && paymentsData.length > 0) {
            const newTransactions = paymentsData.map(payment => ({
                userId: payment.userId,
                merchantId: payment.merchantId || req.user.id,
                paymentId: payment._id,
                amount: payment.amount,
                currency: payment.currency || "USD",
                status: payment.status || "pending",
                providerTransactionId: payment.providerTransactionId,
                receiptUrl: payment.receiptUrl
            }));

            await TransactionModel.insertMany(newTransactions);
            console.log("Successfully stored records in Transaction database.");

            transactions = await TransactionModel.find(dbQuery).limit(10);
        }

        res.status(200).json({
            message: 'Transactions Fetched from Payment Service and Stored Locally',
            result: transactions
        });

    } catch (error) {
        console.error("Error in Transaction Processing:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        });
    }

}

async function TransactionById(req, res) {
    const transactionId = req.params.id;

    try {
        let query = { _id: transactionId };

        if (req.user && req.user.role === 'merchant') {
            query.merchantId = req.user.id;
        } else {
            return res.status(401).json({ message: "Unauthorized: Only merchants can perform this action" });
        }

        const transaction = await TransactionModel.findOne(query);

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: 'Transaction Fetched Successfully',
            result: transaction
        });

    } catch (error) {
        console.error("Error fetching Transaction By Id:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        });
    }
}


async function TransactionCreation(req, res) {
    try {
        const { paymentId, userId, merchantId, amount, currency, providerTransactionId, status } = req.body;
        
        let transaction = await TransactionModel.findOne({ paymentId });
        if (transaction) {
            transaction.status = status;
            transaction.providerTransactionId = providerTransactionId || transaction.providerTransactionId;
            await transaction.save();
        } else {
            transaction = await TransactionModel.create({
                paymentId,
                userId,
                merchantId,
                provider: 'stripe',
                amount,
                currency,
                providerTransactionId,
                status
            });
        }
        
        res.status(200).json({ message: "Transaction processed successfully", result: transaction });
    } catch (error) {
        console.error("Error creating/updating transaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { Transactions, TransactionById, TransactionCreation }
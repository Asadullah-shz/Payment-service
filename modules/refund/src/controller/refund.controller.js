const RefundService = require("../service/refund.service");
const RefundEventModel = require("../model/RefundEvent.model");

async function HandleGatewayRefund(req, res) {
    const event = req.gatewayEvent;

    res.status(200).json({ received: true });

    RefundService.processGatewayEvent(event).catch((error) => {
        console.error(`[Refund Controller] Background processing failed:`, error);
    });
}

async function RefundsDetails(req, res) {
    try {
        const refundsRecords = await RefundEventModel.find({});    
  
        if (!refundsRecords || refundsRecords.length === 0) {
            return res.status(404).json({
                message: "No Refunds Exist"
            });
        }
        
        res.status(200).json({
            message: "Refunds Records Retrieved",
            refundsRecords,
        });

    } catch (error) {
        console.error("Error in Refunds Records", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        });
    }
}

async function RefundsDetailsById(req, res) {
    
    const refundId = req.params.id; 

    try {
        const refundsRecordById = await RefundEventModel.findById(refundId);

       
        if (!refundsRecordById) {
            return res.status(404).json({
                message: "No Refund Exist"
            });
        }

        res.status(200).json({
            message: "Refunds Record Retrieved",
            refundsRecordById, 
        });

    } catch (error) {
        console.error("Error in Refunds Records", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        });
    }
}

async function CreateRefundRecord(req, res) {
    const { merchantId, providerRefundId, amount, currency, reason } = req.body;
    
    try {
        const newRefund = await RefundEventModel.create({
            merchantId,
            provider: "stripe",
            providerRefundId,
            amount,
            currency,
            reason,
            metadata: false,
            processed: false
        });

        res.status(201).json({
            message: "Refund record created successfully",
            refund: newRefund
        });
    } catch (error) {
        console.error("Error creating refund record:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        });
    }
}

module.exports = { HandleGatewayRefund, RefundsDetails, RefundsDetailsById, CreateRefundRecord };

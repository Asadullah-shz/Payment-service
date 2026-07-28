const Payout = require('../model/Payout.model');
const EventBus = require('../../../EventBus/eventBus.service');

async function createPayout(req, res) {
    const { merchantId, amount, currency = 'usd', destination } = req.body;

    try {
        if (!merchantId || !amount || !destination) {
            return res.status(400).json({ message: "merchantId, amount, and destination are required" });
        }

        const payout = await Payout.create({
            merchantId,
            amount,
            currency,
            destination,
            status: 'processing'
        });

        await EventBus.publish('payout.created', {
            payoutId: payout._id,
            merchantId,
            amount,
            status: 'processing'
        });

        res.status(201).json({ message: "Payout Initiated", payout });
    } catch (error) {
        console.error("Error creating payout:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function getPayouts(req, res) {
    try {
        const payouts = await Payout.find({});
        res.status(200).json({ payouts });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function getPayoutById(req, res) {
    try {
        const payout = await Payout.findById(req.params.id);
        if (!payout) return res.status(404).json({ message: "Payout not found" });
        res.status(200).json({ payout });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function cancelPayout(req, res) {
    try {
        const payout = await Payout.findById(req.params.id);
        if (!payout) return res.status(404).json({ message: "Payout not found" });

        if (payout.status !== 'pending' && payout.status !== 'processing') {
            return res.status(400).json({ message: `Cannot cancel payout with status ${payout.status}` });
        }

        payout.status = 'cancelled';
        await payout.save();
        
        await EventBus.publish('payout.cancelled', { payoutId: payout._id, status: 'cancelled' });
        res.status(200).json({ message: "Payout Cancelled", payout });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    createPayout,
    getPayouts,
    getPayoutById,
    cancelPayout
};

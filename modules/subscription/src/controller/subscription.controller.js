const Subscription = require('../model/Subscription.model');
const EventBus = require('../../../EventBus/eventBus.service');

async function createSubscription(req, res) {
    const { merchantId, planName, amount, interval, currency = 'usd', trialPeriodDays = 0 } = req.body;

    try {
        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + trialPeriodDays);
        if (trialPeriodDays === 0) {
           
            if (interval === 'monthly') nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
            else if (interval === 'yearly') nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        }

        const subscription = await Subscription.create({
            merchantId,
            planName,
            amount,
            currency,
            interval,
            trialEnd: trialPeriodDays > 0 ? nextBillingDate : null,
            nextBillingDate
        });

        await EventBus.publish('subscription.created', {
            subscriptionId: subscription._id,
            merchantId,
            planName,
            status: subscription.status
        });

        res.status(201).json({ message: "Subscription Created", subscription });
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function getSubscriptions(req, res) {
    try {
        const subscriptions = await Subscription.find({});
        res.status(200).json({ subscriptions });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function getSubscriptionById(req, res) {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).json({ message: "Subscription not found" });
        res.status(200).json({ subscription });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function updateSubscription(req, res) {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subscription) return res.status(404).json({ message: "Subscription not found" });
        res.status(200).json({ message: "Subscription Updated", subscription });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function pauseSubscription(req, res) {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, { status: 'paused' }, { new: true });
        if (!subscription) return res.status(404).json({ message: "Subscription not found" });
        
        await EventBus.publish('subscription.paused', { subscriptionId: subscription._id, status: 'paused' });
        res.status(200).json({ message: "Subscription Paused", subscription });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function resumeSubscription(req, res) {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        if (!subscription) return res.status(404).json({ message: "Subscription not found" });
        
        await EventBus.publish('subscription.resumed', { subscriptionId: subscription._id, status: 'active' });
        res.status(200).json({ message: "Subscription Resumed", subscription });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function cancelSubscription(req, res) {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
        if (!subscription) return res.status(404).json({ message: "Subscription not found" });
        
        await EventBus.publish('subscription.cancelled', { subscriptionId: subscription._id, status: 'cancelled' });
        res.status(200).json({ message: "Subscription Cancelled", subscription });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    createSubscription,
    getSubscriptions,
    getSubscriptionById,
    updateSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription
};

import Subscription from '../models/subscription.model.js'
import {workflowClient} from "../config/upstash.js";
import {SERVER_URL} from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,  // Spread the request body properties
            user: req.user._id,  // Add the user ID
        });

        const {workflowRunId} = await workflowClient.trigger( {
            url: `${SERVER_URL}/api/workflows/subscription/reminder}`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'Content-Type': 'application/json',
            },
            retries: 0,
        })

        res.status(201).json({ success: true, data: {subscription, workflowRunId} });
    } catch (e) {
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id ) {
            const error = new Error('You are not the owner of the subscriptions or Account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({user: req.params.id});
        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
};

export const getAllSubscriptions =  async   (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        res.status(500).json({ success: true, error: "Unable to get all subscriptions"})
    }
}

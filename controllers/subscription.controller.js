// Importing the Subscription model to interact with the subscription data in the database
import Subscription from '../models/subscription.model.js';
// Importing the workflow client to trigger workflows
import { workflowClient } from "../config/upstash.js";
// Importing the server URL from environment configuration
import { SERVER_URL } from "../config/env.js";

// Function to create a new subscription
export const createSubscription = async (req, res, next) => {
    try {
        // Create a new subscription in the database
        const subscription = await Subscription.create({
            ...req.body,  // Spread all properties from the request body (this includes data like subscription details)
            user: req.user._id,  // Attach the user's ID to the subscription, linking it to the correct user
        });

        // Trigger a workflow to send a subscription reminder (workflow is like an automated task)
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/workflows/subscription/reminder}`, // URL for the workflow (to trigger the reminder)
            body: {
                subscriptionId: subscription.id, // Pass the new subscription ID to the workflow
            },
            headers: {
                'Content-Type': 'application/json', // Set the content type for the request
            },
            retries: 0, // Don't retry the workflow if it fails
        });

        // Respond to the client with a success message, including the subscription details and workflow run ID
        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (e) {
        // If an error occurs, pass the error to the next middleware (error handling)
        next(e);
    }
};

// Function to get subscriptions for a specific user
export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Check if the user is trying to access their own subscriptions (security check)
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of the subscriptions or Account');
            error.status = 401;  // Unauthorized error
            throw error;  // Throw an error if the user is not authorized to access this data
        }

        // Retrieve all subscriptions for the user from the database
        const subscriptions = await Subscription.find({ user: req.params.id });

        // Send the subscriptions data back as a successful response
        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        // If an error occurs, pass the error to the next middleware (error handling)
        next(e);
    }
};

// Function to get all subscriptions from the database (admin or system view)
export const getAllSubscriptions = async (req, res) => {
    try {
        // Retrieve all subscriptions from the database
        const subscriptions = await Subscription.find();

        // Send the list of all subscriptions as a successful response
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        // If an error occurs, respond with an error message
        res.status(500).json({ success: false, error: "Unable to get all subscriptions" });
    }
}

// Importing the mongoose library to interact with MongoDB
import mongoose from 'mongoose';

// Defining a schema for a Subscription model
const subscriptionSchema = new mongoose.Schema({
    // The name of the subscription (e.g., 'Netflix', 'Spotify')
    name: {
        type: String,  // This field should be a string
        required: [true, 'Please enter your Subscription name'],  // This field is required, and a message will show if it's not provided
        trim: true,  // Removes extra spaces from the beginning and end of the name
        minlength: 3,  // The name must have at least 3 characters
        maxlength: 50  // The name must not exceed 50 characters
    },

    // The price of the subscription (e.g., 10.99)
    price: {
        type: Number,  // This field should be a number
        required: [true, 'Please enter your Subscription price'],  // This field is required
        minlength: [0, 'Please enter a valid price which is greater than 0'],  // Price cannot be less than 0
        maxlength: 50  // The price must not exceed 50
    },

    // Currency type for the price (e.g., USD, EUR)
    currency: {
        type: String,  // This field should be a string
        enum: ['USD', 'EUR', 'GBP', 'AED', 'NGN'],  // Only these currency types are allowed
        default: 'USD'  // Default currency is USD if not provided
    },

    // How often the subscription is billed (e.g., daily, monthly)
    frequency: {
        type: String,  // This field should be a string
        enum: ['daily', 'weekly', 'monthly', 'yearly'],  // Only these billing frequencies are allowed
    },

    // The category of the subscription (e.g., sports, entertainment)
    category: {
        type: String,  // This field should be a string
        enum: ['sports', 'entertainment', 'education', 'health', 'travel', 'finance', 'others'],  // Only these categories are allowed
        required: [true, 'Please enter your Subscription category']  // This field is required
    },

    // The method of payment for the subscription (e.g., credit card, PayPal)
    paymentMethod: {
        type: String,  // This field should be a string
        enum: ['credit_card', 'paypal', 'bank_transfer', 'others'],  // Only these payment methods are allowed
        required: [true, 'Please enter your Subscription payment method']  // This field is required
    },

    // The current status of the subscription (e.g., active, expired)
    status: {
        type: String,  // This field should be a string
        enum: ['active', 'expired', 'cancelled'],  // Only these statuses are allowed
        default: 'active'  // Default status is 'active'
    },

    // The start date of the subscription (or when it begins)
    startDate: {
        type: Date,  // This field should be a date
        required: [true, 'Please enter your Subscription start date'],  // This field is required
        validate: {
            // Validator function to ensure the start date is in the past or present
            validator: (value) => value <= new Date(),
            message: 'Start date must be less than current date'  // Error message if the start date is in the future
        }
    },

    // The renewal date of the subscription (when it should renew)
    renewalDate: {
        type: Date,  // This field should be a date
        validate: {
            // Validator function to ensure the renewal date is after the start date
            validator: function (value) {
                return value > this.startDate;  // Renewal date must be later than the start date
            },
            message: 'Renew date must be after start date'  // Error message if the renewal date is before the start date
        }
    },

    // User associated with the subscription (relates to the User model)
    user: {
        type: mongoose.Schema.Types.ObjectId,  // This references the User model by its ObjectId
        ref: 'User',  // Reference to the 'User' model
        required: true,  // This field is required
        index: true,  // Indexing this field for faster lookup
    }
}, {timestamps: true});  // Automatically adds 'createdAt' and 'updatedAt' fields to each subscription document

// Middleware function that runs before saving the document to the database (pre-save hook)
subscriptionSchema.pre('save', function (next) {
    // If the renewal date is not set, calculate it based on the frequency
    if (!this.renewalDate) {
        // Defining how many days after the start date the subscription will renew, based on its frequency
        const renewalPeriods = {
            daily: 1,  // 1 day for daily subscription
            weekly: 7,  // 7 days for weekly subscription
            monthly: 30,  // 30 days for monthly subscription
            yearly: 365  // 365 days for yearly subscription
        };

        // Set the renewal date to the start date plus the relevant number of days based on frequency
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    // If the renewal date has already passed, mark the subscription as expired
    if (this.renewalDate < new Date()) {
        this.status = 'expired';  // Change the status to 'expired'
    }

    // Continue with the save operation
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;

import dayjs from "dayjs";

// Import the 'createRequire' function from the 'module' module.
// This function allows us to create a custom require function with the correct context.
import { createRequire } from 'module';


// Create a custom require function using the current module's URL.
const require = createRequire(import.meta.url);

// Import the 'serve' function from '@upstash/workflow/express'.
// This function is used to create an Express.js server for handling workflow requests.
const { serve } = require('@upstash/workflow/express');

import Subscription from "../models/subscription.model.js";



const  REMINDERS = [7, 5, 2, 1]

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;
    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log (`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`)
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'days');
        console.log(`Sending reminder for subscription ${subscriptionId} on ${reminderDate.format('YYYY-MM-DD')}`);


        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate );
        }

        if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `Reminder ${daysBefore} days before`, subscription);
        }
    }
});


const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}


const sleepUntilReminder = async (context, label, date)  => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate);
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        // Send email, SMS, push notifications ...
    })
}
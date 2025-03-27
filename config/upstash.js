// Importing the 'Client' class from the @upstash/workflow package and renaming it to 'WorkflowClient'
import { Client as WorkflowClient } from "@upstash/workflow";

// Importing the QSTASH_TOKEN and QSTASH_URL from the local env.js file
import { QSTASH_TOKEN, QSTASH_URL } from "./env.js";

// Create a new instance of WorkflowClient by passing in the token and base URL for the workflow service
export const workflowClient = new WorkflowClient({
    token: QSTASH_TOKEN, // API token for authenticating requests to the Upstash service
    baseUrl: QSTASH_URL, // Base URL for the Upstash service
});

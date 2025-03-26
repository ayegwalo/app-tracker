// Importing required modules
import express from "express";  // Express framework to handle routing and HTTP requests

import { PORT } from "./config/env.js";  // Import the PORT value from configuration file

// Importing route handlers for different endpoints
import userRouter from "./routes/user.routes.js";  // Handles user-related routes
import authRouter from "./routes/auth.routes.js";  // Handles authentication routes
import subscriptionRouter from "./routes/subsription.routes.js";  // Handles subscription-related routes

// Import the function to connect to the MongoDB database
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

// Create an instance of the express application
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use(express.static('public'));


// Setting up middleware to handle routes for different API endpoints
app.use('/api/v1/auth', authRouter);  // Authentication routes
app.use('/api/v1/users', userRouter);  // User routes
app.use('/api/v1/subscriptions', subscriptionRouter);  // Subscription routes
app.use('/api/v1/workflows', workflowRouter); // Workflows


app.use(errorMiddleware);

// Route handler for the root endpoint
app.get("/", (req, res) => {
    res.sendFile('index.html', { root: 'public'});  // Sends a welcome message and some HTML as response
});

// Start the server and listen on the specified port
app.listen(PORT, async () => {
    // Log a message when the server is running
    console.log(`App Tracker API is now running on port http://localhost:${PORT}`);

    // Call the function to connect to the MongoDB database
    await connectToDatabase();
});

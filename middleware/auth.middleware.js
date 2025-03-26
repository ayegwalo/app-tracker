// Importing necessary modules
import jwt from "jsonwebtoken"; // This helps us decode and verify the token the user sends.
import { JWT_SECRET } from "../config/env.js"; // This is our secret key used to sign and verify tokens. Keep it private.
import User from "../models/user.model.js"; // Accessing our database to find specific users.

// Middleware to protect certain routes from unauthorized access
const protect = async (req, res, next) => {
    try {
        let token; // A variable to store the user's token (if provided)

        // STEP 1: Check if the user has sent an Authorization header with their token
        // - Authorization headers look like this: "Bearer <token>"
        // - The "Bearer" part is just a keyword, the actual token comes after it.
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Extract the token part by splitting the string and taking the second half (after 'Bearer')
            token = req.headers.authorization.split(' ')[1];
        }

        // STEP 2: Handle the case where the token is NOT provided
        // - Maybe the user forgot to log in or didn't include their token in the request.
        if (!token) {
            // Send back a 401 (Unauthorized) response to indicate the user has no access.
            return res.status(401).json({ message: 'Not authorized' });
        }

        // STEP 3: If the token is provided, verify it to ensure it's genuine and hasn't been tampered with.
        // - `jwt.verify` decodes the token and checks that it was signed with our secret key.
        const decoded = jwt.verify(token, JWT_SECRET);

        // At this point, `decoded` will contain the information we embedded in the token, like the user's ID.
        // Example: { userId: 'someId123', iat: 1698765432, exp: 1698766432 }

        // STEP 4: Use the user's ID (from the token) to look them up in the database.
        const user = await User.findById(decoded.userId);

        // STEP 5: Handle the case where the token is valid, but the user no longer exists
        // - This happens if the user was deleted after the token was created.
        if (!user) {
            // Again, respond with a 401 error because the user is no longer authorized.
            return res.status(401).json({ message: 'User not found' });
        }

        // STEP 6: If everything is okay, attach the user to the `req` object.
        // - By attaching the user to `req`, we make it available for all the routes and controllers that run after this middleware.
        // - For example, you can now use `req.user` in your route handler to access the logged-in user’s details.
        req.user = user;

        // STEP 7: Call `next()` to pass control to the next middleware or route handler
        // - Everything is fine at this point, so we let the request go to the next stage.
        next();
    } catch (error) {
        // STEP 8: Handle any errors that might occur:
        // - For example: token verification failure, invalid token format, etc.
        console.error('Authorization error:', error); // Log the actual error for debugging purposes.

        // Respond with a 401 (Unauthorized) error and include a helpful message for the user.
        res.status(401).json({
            message: 'Invalid or expired token.', // Tells the user their token doesn’t work
            error: error.message,               // Optionally share the detailed reason for debugging.
        });
    }
};

// Export this middleware to use in your app's protected routes
export default protect;
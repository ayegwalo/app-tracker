// Import required modules and libraries
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Import the User model for interacting with the database
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js'; // Import JWT config (secret and expiration)

// Sign-up handler function
export const signUp = async (req, res, next) => {
    // Start a database session to ensure that the user creation process is executed as a single atomic operation.
    // This means that if any step in the process fails (e.g., password hashing, user creation, token generation),
    // the entire operation will be rolled back, maintaining data integrity.

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Destructure user information (name, email, password) from request body
        const { name, email, password } = req.body;


        // Check if any required fields (name, email, password) are missing in the request body.
        // If any of the fields are missing, they are added to the 'missingFields' array to provide a specific error message.
        if (!name || !email || !password) {
            const missingFields = [];
            if (!name) missingFields.push('name'); // Add 'name' to the array if it is missing
            if (!email) missingFields.push('email'); // Add 'email' to the array if it is missing
            if (!password) missingFields.push('password'); // Add 'password' to the array if it is missing


            // Return error if any required field is missing
            return res.status(400).json({
                success: false,
                error: `Please provide your ${missingFields.join(', ')}`,
            });
        }

        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User already exists', // Conflict if user is found
            });
        }

        // Secure the password using bcrypt
        let hashedPassword;
        try {
            const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
            hashedPassword = await bcrypt.hash(password, salt); // Hash the password using the salt
        } catch (err) {
            // Handle any errors during password hashing
            return res.status(500).json({
                success: false,
                error: 'Error occurred while securing the password',
            });
        }

        // Create the new user in the database within the transaction
        let newUser;
        try {
            // Use the session to ensure atomicity
            newUser = await User.create([{ name, email, password: hashedPassword }], { session });
        } catch (err) {
            // Abort the transaction if there’s an error during user creation
            await session.abortTransaction();
            await session.endSession();
            return next(err); // Pass error to error-handling middleware
        }

        // Generate a JWT token for the new user
        let token;
        try {
            // Sign a token with user ID and secret, set expiration time
            token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (err) {
            // Abort transaction and handle token generation error
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                success: false,
                error: 'Error occurred while generating the token',
            });
        }

        // Commit the transaction to persist the changes
        await session.commitTransaction();
        session.endSession();

        // Respond with a success message and the created user data
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token, // Include the generated JWT token
                user: newUser[0], // Return the newly created user data
            },
        });
    } catch (error) {
        // Abort transaction if an error occurs during the process
        await session.abortTransaction();
        session.endSession();
        next(error); // Pass error to your error handling middleware
    }
};

// Sign-in handler function
export const signIn = async (req, res, next) => {
    try {
        // Destructure email and password from request body
        const { email, password } = req.body;

        // Check if the user exists by searching for the email
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('Invalid credentials'); // Create error if user not found
            error.statusCode = 404;
            return next(error); // Pass error to error-handling middleware
        }

        // Compare the entered password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials'); // Create error if password is incorrect
            error.statusCode = 401;
            return next(error); // Stop execution if password doesn't match
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign(
            { userId: user._id }, // Payload containing user ID
            JWT_SECRET, // Secret for signing the token
            { expiresIn: JWT_EXPIRES_IN } // Set expiration time for the token
        );

        // Respond with success, including the generated token and user data
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token, // Include the JWT token in the response
                user,  // Return user data
            },
        });

    } catch (error) {
        next(error); // Pass error to error-handling middleware
    }
};

// Sign-out handler function (currently not implemented)
export const signOut = async (req, res, next) => {
    // Logic for sign out could be implemented here (e.g., invalidate the JWT token or clear session data)
}

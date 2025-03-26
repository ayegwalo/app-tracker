import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        // Validation: Check required fields
        if (!name || !email || !password) {
            const missingFields = [];
            if (!name) missingFields.push('name');
            if (!email) missingFields.push('email');
            if (!password) missingFields.push('password');

            return res.status(400).json({
                success: false,
                error: `Please provide your ${missingFields.join(', ')}`,
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User already exists',
            });
        }

        // Secure the password
        let hashedPassword;
        try {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: 'Error occurred while securing the password',
            });
        }

        // Create the user in a database transaction
        let newUser;
        try {
            newUser = await User.create([{ name, email, password: hashedPassword }], { session });
        } catch (err) {
            await session.abortTransaction();
            await session.endSession();
            return next(err); // Handle potential database errors
        }

        // Generate a JWT token
        let token;
        try {
            token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                success: false,
                error: 'Error occurred while generating the token',
            });
        }

        // Commit the transaction and clean up
        await session.commitTransaction();
        session.endSession();

        // Send success response
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUser[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error); // Pass the error to your error handling middleware
    }
};



export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 404;
            return next(error); // Pass error to error-handling middleware
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error); // Stop execution if password is invalid
        }

        // Generate a token
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user,
            },
        });

    } catch (error) {
        next(error); // Pass error to the error-handling middleware
    }
};


export const signOut = async (req, res, next) => {

}
// Importing Router from Express to create modular, mountable route handlers
import { Router } from 'express';

// Importing the authentication controller functions
// These functions (signIn, signOut, signUp) will handle respective HTTP requests
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

// Creating a new instance of the Router for authentication-related routes
const authRouter = Router();

// Defining the route for user sign-up
// This route handles POST requests to '/sign-up' and executes the signUp controller function
authRouter.post('/sign-up/', signUp);

// Defining the route for user sign-in
// This route handles POST requests to '/sign-in' and executes the signIn controller function
authRouter.post('/sign-in/', signIn);

// Defining the route for user sign-out
// This route handles POST requests to '/sign-out' and executes the signOut controller function
authRouter.post('/sign-out/', signOut);

// Exporting the authRouter to be used in other parts of the application
export default authRouter;
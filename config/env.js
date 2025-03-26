import { config } from "dotenv";

// Load the environment variables from a specific .env file based on the current NODE_ENV value
// If NODE_ENV is not set, it defaults to 'development', and .env file is loaded
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// Destructure and export the PORT environment variable from process.env
// This allows us to use PORT elsewhere in the application
export const {
    PORT,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    DB_URI,
    ARCJET_ENV,
    ARCJET_KEY,
    QSTASH_TOKEN,
    QSTASH_URL,
    SERVER_URL,
    EMAIL_PASSWORD
} = process.env;

// Log the PORT value to ensure it's being read correctly
console.log(`PORT: ${PORT}`);

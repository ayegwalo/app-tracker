# App Tracker

A simple application to track user activities and workflows.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)


## Installation

**Clone the repository:**

```bash
git clone https://github.com/your-username/app-tracker.git
cd app-tracker

**Install dependencies:**
npm install

**Configuration**
Create a .env file in the root directory and add the following variables:

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/app-tracker?retryWrites=true&w=majority
ARCJET_API_KEY=your_arcjet_api_key
NODEMAILER_EMAIL=your_email@example.com
NODEMAILER_PASSWORD=your_email_password
UPSTASH_REST_URL=https://api.upstash.com/v1/caches
UPSTASH_REST_KEY=your_upstash_rest_key
UPSTASH_REST_SECRET=your_upstash_rest_secret

**API Endpoints**
  /api/auth
  POST /register - Register a new user
  POST /login - Login a user
**/api/subscriptions**
  GET / - Get all subscriptions
  POST / - Create a new subscription
  GET /:id - Get a subscription by ID
  PUT /:id - Update a subscription by ID
  DELETE /:id - Delete a subscription by ID
**/api/users**
GET / - Get all users
GET /:id - Get a user by ID
PUT /:id - Update a user by ID
DELETE /:id - Delete a user by ID

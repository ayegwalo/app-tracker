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

**NOTE**
Create new user
Use a POST request to create a new user.
Endpoint: http://localhost:5000/api/v1/auth/sign-up
Request Body:
{
  "name": "Christopher Aywgwalo",
  "email": "chris.relaxier@gmail.com",
  "password": "1234567"
}

Sign-in
Use a POST request to sign in a user.
Endpoint: http://localhost:5000/api/v1/auth/sign-in
Request Body:
{
  "email": "chris.relaxier1@gmail.com",
  "password": "1234567"
}


Note: If JWT token is expired, You will need to replace it with a valid token to make subsequent authenticated requests.


**Get users**
Use a GET request to retrieve all users.
Endpoint: http://localhost:5000/api/v1/users
Authorization: Bearer token (replace with a valid JWT token)

**Create subscription**
Use a POST request to create a new subscription.
Endpoint: http://localhost:5000/api/v1/subscriptions
Authorization: Bearer token (replace with a valid JWT token)
Request Body:
{
  "name": "Amazon Pitch",
  "price": 40.98,
  "currency": "AED",
  "frequency": "monthly",
  "category": "entertainment",
  "startDate": "January, 2025, UTC",
  "paymentMethod": "credit_card"
}

Get Subscriptions
Use a GET request to retrieve all subscriptions for a specific user.
Endpoint: http://localhost:5000/api/v1/subscriptions/user/:ID
Authorization: Bearer token (replace with a valid JWT token)
Replace :ID with the actual user ID.


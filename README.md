# 📱 App Tracker

A full-stack Node.js application to track user activities and workflows — including subscription management, secure authentication, and performance optimization with caching and rate-limiting.

---

## 🚀 Features

- 🔐 **Authentication** – JWT-based login/register system
- 📬 **Email Notifications** – Welcome emails via Nodemailer
- 💾 **Database** – MongoDB (Mongoose)
- ⚡ **Caching** – Upstash (Redis)
- 🛡️ **Security** – Arcjet integration for bot protection, rate limiting
- 🔧 **API-First Design** – RESTful routes for users and subscriptions
- 🧪 **Environment Config** – dotenv for secure keys
- ⚙️ **Production-Ready** – Built with best practices for scaling

---

## 🛠️ Tech Stack

| Category        | Tools / Libraries                     |
|----------------|----------------------------------------|
| Backend         | Node.js, Express.js                   |
| Database        | MongoDB, Mongoose                     |
| Auth & Security | JWT, Arcjet, dotenv                   |
| Email           | Nodemailer                            |
| Caching         | Upstash (Redis)                       |
| DevOps          | Git, .env configs                     |
| Async Handling  | async/await                           |

---

## 📦 Installation

```bash
git clone https://github.com/ayegwalo/app-tracker.git
cd app-tracker
npm install


MONGODB_URI=your_mongodb_connection
ARCJET_API_KEY=your_arcjet_api_key
NODEMAILER_EMAIL=your_email@example.com
NODEMAILER_PASSWORD=your_email_password
UPSTASH_REST_URL=https://api.upstash.com/v1/caches
UPSTASH_REST_KEY=your_upstash_key
UPSTASH_REST_SECRET=your_upstash_secret

Method | Endpoint | Description
POST   | /api/v1/auth/sign-up | Register a new user
POST   | /api/v1/auth/sign-in | Login an existing user

Method | Endpoint      | Description
GET    | /api/v1/users | Get all users

Method | Endpoint                           | Description
GET    | /api/v1/subscriptions              | Get all subscriptions
POST   | /api/v1/subscriptions              | Create a new subscription
GET    | /api/v1/subscriptions/:id          | Get by ID
PUT    | /api/v1/subscriptions/:id          | Update by ID
DELETE | /api/v1/subscriptions/:id          | Delete by ID
GET    | /api/v1/subscriptions/user/:userId | Get by User ID


🧠 Fun Fact
This project was part of my journey transitioning from STEM educator to certified DevOps engineer and full-stack developer. Built using best practices, and designed for learning + scalability!

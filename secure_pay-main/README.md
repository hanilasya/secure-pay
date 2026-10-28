# SecurePay – Payment Gateway Prototype

## About the Project
SecurePay is a college project that demonstrates a secure payment gateway system with separate customer, payment, and admin portals.

## Features
- User registration and login
- Password hashing using bcrypt
- Session-based authentication
- Role-based access control for customers and administrators
- Payment processing simulation using dummy data
- Input validation and login rate limiting
- Security event logging
- MongoDB database integration

## Technologies Used
- **Frontend:** React, Vite, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Security:** bcryptjs, express-session, express-rate-limit

## Project Structure
```text
secure_pay/
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── seed.js
│   └── package.json
└── frontend/
    ├── src/
    ├── vite.config.js
    └── package.json
```

## Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/SaiHansikaBoddu/secure_pay.git
cd secure_pay
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

Configure the required environment variables, including `MONGODB_URI`, `SESSION_SECRET`, and `FRONTEND_URL`, before starting the backend.

### 3. Install frontend dependencies
Open a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

## Security Notice
This is a college project prototype. Use dummy payment data only. Do not commit passwords, API secrets, or `.env` files to GitHub.

## Author
SecurePay College Project Team

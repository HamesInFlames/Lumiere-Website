# 🍰 Lumière Patisserie - Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Backend Configuration](#backend-configuration)
5. [Environment Variables](#environment-variables)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Authorization](#authentication--authorization)
8. [Admin Credentials](#admin-credentials)
9. [Getting Started](#getting-started)
10. [Development Workflow](#development-workflow)

---

## 🎯 Project Overview

**Lumière Patisserie** is a full-stack application for managing a patisserie business with three main components:

1. **Website** (`Lumiere-web/App`) - Customer-facing React website for browsing products and placing pre-orders
2. **Backend API** (`Lumiere-web/Backend`) - Node.js/Express REST API with MongoDB
3. **Mobile App** (`Lumiere-App`) - React Native app for workers (Admin, Pastry Chef, Barista)

### Key Features
- **Pre-order System**: Customers can place orders through the website
- **Order Management**: Google Calendar-style view for workers to manage orders
- **Role-Based Access**: Three user roles (Admin, Pastry Chef, Barista)
- **Inventory Management**: Track inventory items and low stock alerts
- **Order Tracking**: Customers can track their orders via order number
- **Email Notifications**: Confirmation emails and pickup notifications

---

## 📁 Project Structure

```
LUMIERE_WEB_MAIN/
├── Lumiere-web/
│   ├── App/                    # React Website (Frontend)
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   ├── pages/          # Page components
│   │   │   ├── context/        # React Context (Cart)
│   │   │   ├── lib/            # API utilities
│   │   │   └── styles/         # CSS files
│   │   └── public/             # Static assets
│   │
│   └── Backend/                # Node.js API (Backend)
│       ├── src/
│       │   ├── config/         # Database config
│       │   ├── controllers/    # Route controllers
│       │   ├── middleware/     # Auth & error middleware
│       │   ├── models/         # Mongoose models
│       │   ├── routes/         # API routes
│       │   └── products/       # Product seed data
│       ├── seed/               # Database seed scripts
│       └── server.js           # Express server entry point
│
└── Lumiere-App/                # React Native Mobile App
    └── src/
        ├── screens/            # App screens
        ├── navigation/         # React Navigation
        ├── store/              # Zustand state management
        └── config/             # API configuration
```

---

## 🗄️ MongoDB Atlas Setup

### ✅ Current Status: **CONNECTED**

Your MongoDB Atlas cluster is set up and connected:

- **Cluster Name**: `lumiere-web-cluster`
- **Database Name**: `lumiere`
- **Connection Status**: ✅ Active
- **Setup Guide**: See `Lumiere-web/Backend/MONGODB_ATLAS_SETUP.md`

### Connection String
```
mongodb+srv://dev:IIbopkPblxcwtk6l@lumiere-web-cluster.g73jwih.mongodb.net/lumiere?retryWrites=true&w=majority
```

**⚠️ Security Note**: This connection string contains credentials. Never commit it to version control!

---

## ⚙️ Backend Configuration

### Server Details
- **Port**: `3000` (default, configurable via `PORT` env variable)
- **Base URL**: `http://localhost:3000`
- **Health Check**: `http://localhost:3000/healthz`

### Technology Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **Development**: Nodemon (auto-restart)

### Available Scripts
```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Seed admin user and signup keys
npm run seed:admin

# Seed sample products (if available)
npm run seed
```

---

## 🔐 Environment Variables

### Required Variables

Create a `.env` file in `Lumiere-web/Backend/` with the following:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://dev:IIbopkPblxcwtk6l@lumiere-web-cluster.g73jwih.mongodb.net/lumiere?retryWrites=true&w=majority

# Server Port
PORT=3000

# JWT Secret (change in production!)
JWT_SECRET=lumiere-patisserie-secret-key-change-in-production-2024

# CORS Origins (comma-separated)
CORS_ORIGIN=http://localhost:8000,http://localhost:5173,http://localhost:19006

# Email Configuration (for order confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM=noreply@lumiere-patisserie.com
MAIL_TO=orders@lumiere-patisserie.com

# Node Environment
NODE_ENV=development
```

### Environment Variable Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes | - |
| `PORT` | Server port | ❌ No | `5000` |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ Yes | - |
| `CORS_ORIGIN` | Allowed CORS origins | ❌ No | `*` (all) |
| `SMTP_HOST` | Email server host | ❌ No | - |
| `SMTP_PORT` | Email server port | ❌ No | `587` |
| `SMTP_USER` | Email username | ❌ No | - |
| `SMTP_PASS` | Email password | ❌ No | - |
| `NODE_ENV` | Environment mode | ❌ No | `development` |

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
- **GET** `/` - API status
- **GET** `/healthz` - Health check with MongoDB status

---

### 📦 Products (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | ❌ No |
| GET | `/api/products/:idOrSlug` | Get single product | ❌ No |
| POST | `/api/products` | Create product | ✅ Yes (Admin) |
| PUT | `/api/products/:id` | Update product | ✅ Yes (Admin) |
| DELETE | `/api/products/:id` | Delete product | ✅ Yes (Admin) |

---

### 👤 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new worker | ❌ No (needs signup key) |
| POST | `/api/auth/login` | Login worker | ❌ No |
| GET | `/api/auth/me` | Get current user | ✅ Yes |
| POST | `/api/auth/signup-keys` | Create signup key | ✅ Yes (Admin) |
| GET | `/api/auth/signup-keys` | Get all signup keys | ✅ Yes (Admin) |
| DELETE | `/api/auth/signup-keys/:id` | Deactivate signup key | ✅ Yes (Admin) |
| GET | `/api/auth/workers` | Get all workers | ✅ Yes (Admin) |
| PATCH | `/api/auth/workers/:id/toggle-active` | Toggle worker active status | ✅ Yes (Admin) |

---

### 📋 Orders (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create new order | ❌ No (optional) |
| GET | `/api/orders` | Get all orders (filtered by role) | ✅ Yes |
| GET | `/api/orders/:id` | Get single order | ✅ Yes |
| PATCH | `/api/orders/:id/status` | Update order status | ✅ Yes |
| PATCH | `/api/orders/:id/pay` | Mark order as paid | ✅ Yes (Admin/Barista) |
| GET | `/api/orders/track/:orderNumber` | Track order (public) | ❌ No |
| POST | `/api/orders/min-pickup-date` | Calculate min pickup date | ❌ No |

---

### 📦 Inventory (`/api/inventory`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/inventory` | Get all inventory items | ✅ Yes |
| GET | `/api/inventory/alerts` | Get low stock alerts | ✅ Yes |
| POST | `/api/inventory` | Create inventory item | ✅ Yes |
| PUT | `/api/inventory/:id` | Update inventory item | ✅ Yes |
| DELETE | `/api/inventory/:id` | Delete inventory item | ✅ Yes (Admin) |
| PATCH | `/api/inventory/:id/quantity` | Update quantity | ✅ Yes |
| POST | `/api/inventory/end-of-day` | End of day update | ✅ Yes |
| GET | `/api/inventory/:id/logs` | Get inventory logs | ✅ Yes |

---

### 📧 Contact (`/api/contact`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/contact` | Submit contact form | ❌ No |

---

## 🔒 Authentication & Authorization

### User Roles

1. **Admin** - Full access to all features
2. **Pastry Chef** - Can view and fulfill orders, manage inventory
3. **Barista** - Can view orders, mark as paid, manage inventory

### Authentication Flow

1. **Signup**: Requires a valid signup key for the desired role
2. **Login**: Returns JWT token
3. **Protected Routes**: Include `Authorization: Bearer <token>` header

### Example Request
```javascript
// Login
POST /api/auth/login
{
  "email": "admin@lumiere.com",
  "password": "admin123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@lumiere.com",
    "role": "admin"
  }
}

// Use token in subsequent requests
GET /api/orders
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👨‍💼 Admin Credentials

### Initial Admin User
- **Email**: `admin@lumiere.com`
- **Password**: `admin123`
- **Role**: `admin`

**⚠️ IMPORTANT**: Change this password in production!

### Signup Keys

These keys are required for new worker signups:

- **Pastry Chef Key**: `PASTRY2024`
- **Barista Key**: `BARISTA2024`

**Note**: Only admins can create new signup keys via the API.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Lumiere-web/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   - Copy from `env.template`
   - Add your MongoDB Atlas connection string
   - Configure other environment variables

4. **Seed admin user**
   ```bash
   npm run seed:admin
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Verify server is running**
   - Visit: `http://localhost:3000`
   - Should see: `{"ok":true,"service":"Lumière Pâtisserie API"}`

### Frontend Setup (Website)

1. **Navigate to app directory**
   ```bash
   cd Lumiere-web/App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access website**
   - Usually runs on: `http://localhost:5173`

### Mobile App Setup

1. **Navigate to app directory**
   ```bash
   cd Lumiere-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL**
   - Update `src/config/api.js` with your backend URL
   - For local testing: `http://192.168.x.x:3000` (your local IP)

4. **Run on device/emulator**
   ```bash
   # iOS
   npx expo start --ios
   
   # Android
   npx expo start --android
   ```

---

## 💻 Development Workflow

### Running All Services

**Terminal 1 - Backend**
```bash
cd Lumiere-web/Backend
npm run dev
```

**Terminal 2 - Website**
```bash
cd Lumiere-web/App
npm run dev
```

**Terminal 3 - Mobile App** (if needed)
```bash
cd Lumiere-App
npm start
```

### Testing API Endpoints

You can test endpoints using:
- **Browser**: Visit `http://localhost:3000/api/products`
- **Postman**: Import endpoints and test with authentication
- **curl**: Command-line tool
- **Thunder Client**: VS Code extension

### Common Tasks

**Reset Admin User**
```bash
cd Lumiere-web/Backend
npm run seed:admin
```

**Check MongoDB Connection**
```bash
# Visit in browser
http://localhost:3000/healthz

# Should return:
{
  "ok": true,
  "mongoState": 1  // 1 = connected
}
```

**View Logs**
- Backend logs appear in the terminal running `npm run dev`
- MongoDB connection status is logged on startup

---

## 📝 Notes

### Database Collections
- `users` - Worker accounts
- `signupkeys` - Signup keys for role-based registration
- `orders` - Customer orders
- `products` - Product catalog
- `inventory` - Inventory items
- `inventorylogs` - Inventory change history

### Order Status Flow
1. `pending` - Order placed, not yet started
2. `in_progress` - Being prepared
3. `ready` - Ready for pickup
4. `completed` - Picked up by customer
5. `cancelled` - Order cancelled

### Pickup Date Rules
- **Cakes & Personal Desserts**: Minimum 2 days from order date
- **Pastries & Breads**: Minimum 1 day (24 hours) from order date
- Business hours are considered (not 24/7)

---

## 🔗 Useful Links

- **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/healthz
- **MongoDB Setup Guide**: `Lumiere-web/Backend/MONGODB_ATLAS_SETUP.md`

---

## ⚠️ Important Reminders

1. **Never commit `.env` file** to version control
2. **Change default passwords** before production deployment
3. **Update JWT_SECRET** to a strong random string in production
4. **Restrict CORS origins** to your actual domains in production
5. **Use environment variables** for all sensitive configuration
6. **Backup your MongoDB database** regularly

---

**Last Updated**: November 29, 2025  
**Project Status**: ✅ Backend Connected & Running


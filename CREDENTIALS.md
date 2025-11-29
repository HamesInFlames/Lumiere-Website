# 🔐 Lumière Patisserie - Login Credentials & Signup Keys

## ⚠️ IMPORTANT: Keep this file secure and never commit it to version control!

---

## 👨‍💼 Admin Login

**Email**: `admin@lumiere.com`  
**Password**: `admin123`

**⚠️ CHANGE THIS PASSWORD IN PRODUCTION!**

---

## 🔑 Signup Keys

These keys are required for new workers to sign up:

### Pastry Chef
- **Key**: `PASTRY2024`
- **Role**: `pastry_chef`

### Barista
- **Key**: `BARISTA2024`
- **Role**: `barista`

---

## 📝 How to Use

### For Admin Login (Mobile App)
1. Open the Lumière App
2. Enter email: `admin@lumiere.com`
3. Enter password: `admin123`
4. Tap "Login"

### For Worker Signup (Mobile App)
1. Open the Lumière App
2. Tap "Sign Up"
3. Enter your details
4. Select your role (Pastry Chef or Barista)
5. Enter the corresponding signup key:
   - Pastry Chef: `PASTRY2024`
   - Barista: `BARISTA2024`
6. Complete signup

---

## 🔄 Creating New Signup Keys

Only admins can create new signup keys via the API:

```bash
POST /api/auth/signup-keys
Authorization: Bearer <admin-token>
{
  "key": "NEWKEY2024",
  "role": "pastry_chef",
  "description": "New signup key"
}
```

---

## 📱 API Endpoints for Testing

### Login
```bash
POST http://localhost:3000/api/auth/login
{
  "email": "admin@lumiere.com",
  "password": "admin123"
}
```

### Get Current User
```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer <token>
```

---

**Last Updated**: November 29, 2025  
**Status**: ✅ Active


# 🧪 Lumière Pâtisserie - Testing Guide

## 📋 Prerequisites

### 1. MongoDB (Required for Orders & Auth)
You need MongoDB running locally or a connection string.

**Option A: Local MongoDB**
- Install MongoDB Community Edition: https://www.mongodb.com/try/download/community
- Start MongoDB service: `mongod` (or start as Windows service)

**Option B: MongoDB Atlas (Cloud - Free)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Add to `.env` file in `Lumiere-web/Backend/`:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumiere?retryWrites=true&w=majority
  ```

### 2. Environment Variables
Create `.env` file in `Lumiere-web/Backend/`:
```env
MONGODB_URI=mongodb://localhost:27017/lumiere
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:8000,http://localhost:5173

# Email (Optional - for order confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM=noreply@lumiere-patisserie.com
MAIL_TO=orders@lumiere-patisserie.com
```

---

## 🚀 Starting the Services

### Terminal 1: Backend API
```powershell
cd C:\Users\xoxok\Downloads\LUMIERE_WEB_MAIN\Lumiere-web\Backend
npm install
npm run seed:admin  # Creates admin user + signup keys
npm run dev
```
**Should see:** `✅ Lumière API running on http://localhost:3000`

### Terminal 2: Website (Customer Frontend)
```powershell
cd C:\Users\xoxok\Downloads\LUMIERE_WEB_MAIN\Lumiere-web\App
npm install
npm run dev
```
**Should open:** `http://localhost:8000` (or check terminal output)

### Terminal 3: Mobile App (Worker App)
```powershell
cd C:\Users\xoxok\Downloads\LUMIERE_WEB_MAIN\Lumiere-App
npm install
npm start
```
**Then:** Scan QR code with Expo Go app on your phone

---

## ✅ Testing Checklist

### 🌐 Website Testing (Customer Side)

#### 1. Browse Products
- [ ] Go to `http://localhost:8000`
- [ ] Click "Menu" → Browse categories
- [ ] Click on a product → See product details

#### 2. Shopping Cart
- [ ] Add product to cart (click "Add to Cart")
- [ ] For cakes: Test custom message & candle options
- [ ] Click cart icon → See cart drawer
- [ ] Update quantities in cart
- [ ] Remove items from cart

#### 3. Pre-Order Checkout
- [ ] Click "Proceed to Pre-Order" from cart
- [ ] Fill in customer info:
  - Full Name
  - Email
  - Phone
- [ ] Select pickup date (should enforce 1-2 day minimum)
- [ ] Select pickup time
- [ ] Submit order
- [ ] See confirmation page with order number
- [ ] Check email for confirmation (if SMTP configured)

#### 4. Test Lead Times
- [ ] Add a cake → Should require 2 days minimum
- [ ] Add only pastries/bread → Should require 1 day minimum
- [ ] Try selecting today's date → Should be blocked

---

### 📱 Mobile App Testing (Worker Side)

#### 1. Setup & Login
- [ ] Install Expo Go on your phone
- [ ] Scan QR code from `npm start`
- [ ] App should open on phone

#### 2. Sign Up (First Time)
- [ ] Click "Sign Up"
- [ ] Fill in:
  - First Name, Last Name
  - Email
  - Password
  - Select Role (Pastry Chef or Barista)
  - Enter Signup Key:
    - Pastry Chef: `PASTRY2024`
    - Barista: `BARISTA2024`
- [ ] Submit → Should log in automatically

#### 3. Admin Login
- [ ] Email: `admin@lumiere.com`
- [ ] Password: `admin123`
- [ ] Should see Admin tab

#### 4. Orders Calendar (All Roles)
- [ ] View orders in calendar
- [ ] Switch between Day/Week/Month views
- [ ] Click on an order → See details
- [ ] Test hourly view (daily view)

#### 5. Pastry Chef Features
- [ ] View orders assigned to you
- [ ] Mark order as "In Progress"
- [ ] Mark order as "Ready" → Should send email to customer
- [ ] View order details with custom messages/candles

#### 6. Barista Features
- [ ] Create in-person order (FAB button)
- [ ] Add items to order
- [ ] Mark order as paid (cash/card)
- [ ] Mark order as "Picked Up"
- [ ] View ready orders

#### 7. Inventory Management
- [ ] View inventory list
- [ ] Filter by category (Pastry/Barista/Shared)
- [ ] Add new inventory item
- [ ] Update quantities (Add/Remove/Adjust)
- [ ] View low stock alerts
- [ ] Check activity logs

#### 8. Admin Features
- [ ] Create new signup keys
- [ ] View all workers
- [ ] Activate/Deactivate workers
- [ ] View all orders

---

## 🔐 Default Test Credentials

### Admin Account
- **Email:** `admin@lumiere.com`
- **Password:** `admin123`

### Signup Keys (for new workers)
- **Pastry Chef:** `PASTRY2024`
- **Barista:** `BARISTA2024`

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB or use MongoDB Atlas connection string

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** 
```powershell
Get-Process -Name node | Stop-Process -Force
```

**Missing Package:**
```
Error: Cannot find package 'jsonwebtoken'
```
**Solution:**
```powershell
cd Lumiere-web/Backend
npm install
```

### Website Issues

**API Not Connecting:**
- Check backend is running on port 3000
- Check Vite proxy in `vite.config.js` points to `http://localhost:3000`
- Check browser console for CORS errors

**Cart Not Working:**
- Check browser console for errors
- Clear localStorage: `localStorage.clear()` in browser console

### Mobile App Issues

**Can't Connect to Backend:**
- Make sure phone and computer are on same WiFi network
- Update IP in `Lumiere-App/src/config/api.js` (currently: `192.168.137.237`)
- Check backend is running
- Check firewall allows port 3000

**Expo Go Not Working:**
- Make sure you have Expo Go installed
- Try `npm start -- --clear` to clear cache
- Check Expo CLI is installed: `npm install -g expo-cli`

---

## 📊 Test Scenarios

### Scenario 1: Complete Order Flow
1. **Customer** places order on website
2. **Pastry Chef** sees order in app → Marks as "In Progress"
3. **Pastry Chef** marks as "Ready" → Customer gets email
4. **Barista** sees ready order → Marks as "Picked Up"

### Scenario 2: In-Person Order
1. **Barista** creates order in app
2. **Barista** marks as paid
3. **Pastry Chef** prepares order
4. **Barista** marks as picked up

### Scenario 3: Inventory Management
1. **Pastry Chef** adds "Eggs" to inventory
2. **Pastry Chef** uses 12 eggs → Updates quantity
3. **System** alerts when below minimum
4. **Admin** views all inventory logs

---

## ✅ Success Criteria

- [ ] Website loads and displays products
- [ ] Cart adds/removes items correctly
- [ ] Checkout form validates properly
- [ ] Orders are created in database
- [ ] Mobile app connects to backend
- [ ] Workers can log in with signup keys
- [ ] Orders appear in calendar view
- [ ] Status updates work (in progress → ready → picked up)
- [ ] Inventory tracking works
- [ ] Email notifications sent (if SMTP configured)

---

## 🎯 Next Steps After Testing

1. **Fix any bugs** found during testing
2. **Set up production MongoDB** (MongoDB Atlas recommended)
3. **Configure email** (SMTP settings)
4. **Deploy backend** (Heroku, Railway, Render, etc.)
5. **Deploy website** (Vercel, Netlify, etc.)
6. **Build mobile app** for iOS/Android stores

---

**Happy Testing! 🧁☕**


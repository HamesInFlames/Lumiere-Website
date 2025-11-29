# Lumière Pâtisserie - Worker App

A React Native mobile app for Lumière Pâtisserie workers to manage orders, inventory, and more.

## 🎯 Features

### For All Workers
- 📅 **Calendar View** - See orders organized by day, week, or month
- 📦 **Inventory Management** - Track and update stock levels
- 🔔 **Low Stock Alerts** - Get notified when supplies are running low
- 👤 **Profile Management** - View your role and permissions

### For Pastry Chefs 🧁
- View all incoming orders
- Mark orders as "In Progress"
- Mark orders as "Ready" (triggers customer notification)
- Manage pastry-related inventory

### For Baristas ☕
- Create in-person orders with payment processing
- Mark orders as "Picked Up"
- Process payments (cash/card)
- Manage barista-related inventory

### For Admins 👑
- All permissions from Pastry Chefs and Baristas
- Create and manage signup keys for new workers
- Activate/deactivate worker accounts
- View all analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (for testing)

### Installation

1. **Navigate to the app directory:**
   ```bash
   cd Lumiere-App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the API URL:**
   
   Edit `src/config/api.js` and update the `API_BASE_URL`:
   ```javascript
   // For development, use your computer's local IP
   const API_BASE_URL = __DEV__ 
     ? 'http://YOUR_LOCAL_IP:5000'  // e.g., 'http://192.168.1.100:5000'
     : 'https://api.lumiere-patisserie.com';
   ```
   
   To find your local IP:
   - Windows: Run `ipconfig` in terminal
   - Mac: Run `ifconfig | grep "inet "` in terminal

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Scan the QR code** with Expo Go (Android) or Camera (iOS)

## 📱 Screens

### Authentication
- **Login** - Email and password login
- **Signup** - Create account with role-specific signup key

### Orders (Calendar Tab)
- **Calendar View** - Daily, weekly, monthly views
- **Order Detail** - Full order information with actions
- **New Order** - Create in-person orders (baristas only)

### Inventory
- **Inventory List** - View all items by category
- **Inventory Detail** - Update quantities, view logs

### Profile
- View your account info and permissions
- Logout

### Admin (Admin only)
- **Signup Keys** - Create and manage worker signup keys
- **Workers** - View and manage worker accounts

## 🔐 Authentication

### Default Credentials (Development)

After running the seed script on the backend:

**Admin Account:**
- Email: `admin@lumiere.com`
- Password: `admin123`

**Signup Keys:**
- Pastry Chef: `PASTRY2024`
- Barista: `BARISTA2024`

## 🏗️ Project Structure

```
Lumiere-App/
├── App.js                 # Entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── src/
│   ├── config/
│   │   └── api.js         # API configuration
│   ├── store/
│   │   ├── authStore.js   # Authentication state
│   │   ├── orderStore.js  # Orders state
│   │   └── inventoryStore.js  # Inventory state
│   ├── navigation/
│   │   ├── RootNavigator.js   # Auth/Main routing
│   │   └── MainTabNavigator.js  # Tab navigation
│   └── screens/
│       ├── auth/
│       │   ├── LoginScreen.js
│       │   └── SignupScreen.js
│       ├── calendar/
│       │   └── CalendarScreen.js
│       ├── orders/
│       │   ├── OrderDetailScreen.js
│       │   └── NewOrderScreen.js
│       ├── inventory/
│       │   ├── InventoryScreen.js
│       │   └── InventoryDetailScreen.js
│       ├── profile/
│       │   └── ProfileScreen.js
│       └── admin/
│           └── AdminScreen.js
└── assets/                # App icons and splash screen
```

## 🔧 Backend Connection

This app connects to the shared Lumière backend API. Make sure the backend is running:

```bash
cd ../Lumiere-web/Backend
npm install
npm run seed:admin  # Create admin user and signup keys
npm run dev         # Start the server
```

## 📱 Building for Production

### Android
```bash
expo build:android
# or
eas build --platform android
```

### iOS
```bash
expo build:ios
# or
eas build --platform ios
```

## 🎨 Design

The app uses a dark theme with the Lumière brand colors:
- **Primary:** `#d4a574` (Gold/Caramel)
- **Background:** `#1a1a2e` (Dark Navy)
- **Card:** `#2d2d44` (Dark Purple-Gray)
- **Success:** `#2ecc71` (Green)
- **Warning:** `#ffa500` (Orange)
- **Error:** `#e74c3c` (Red)

## 📝 License

Proprietary - Lumière Pâtisserie


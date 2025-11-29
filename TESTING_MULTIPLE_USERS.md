# 👥 Testing as Multiple Users - Guide

## ✅ Test Accounts Created

You now have **3 test accounts** ready to use:

### 1. Admin
- **Email**: `admin@lumiere.com`
- **Password**: `admin123`
- **Role**: Admin (full access)

### 2. Pastry Chef
- **Email**: `pastry@lumiere.com`
- **Password**: `pastry123`
- **Role**: Pastry Chef

### 3. Barista
- **Email**: `barista@lumiere.com`
- **Password**: `barista123`
- **Role**: Barista

---

## 🖥️ Method 1: Different Browser Windows (Easiest)

### Step-by-Step:

1. **Window 1 - Admin:**
   - Open your app in a regular browser window
   - Login with: `admin@lumiere.com` / `admin123`
   - Keep this window open

2. **Window 2 - Pastry Chef:**
   - Open a **new incognito/private window** (Ctrl+Shift+N in Chrome/Edge)
   - Go to: `http://localhost:8081` (or your Expo web URL)
   - Login with: `pastry@lumiere.com` / `pastry123`
   - You're now logged in as a different user!

3. **Window 3 - Barista:**
   - Open **another incognito window** (or use a different browser)
   - Go to: `http://localhost:8081`
   - Login with: `barista@lumiere.com` / `barista123`

### Why This Works:
- **Regular window** = separate storage (logged in as admin)
- **Incognito window 1** = separate storage (logged in as pastry chef)
- **Incognito window 2** = separate storage (logged in as barista)
- Each window maintains its own login session!

---

## 🌐 Method 2: Different Browsers

Use different browsers for each user:

1. **Chrome** → Admin (`admin@lumiere.com`)
2. **Firefox** → Pastry Chef (`pastry@lumiere.com`)
3. **Edge** → Barista (`barista@lumiere.com`)

Each browser has separate storage, so they won't interfere with each other.

---

## 📱 Method 3: Mobile + Web

1. **Web Browser** → Login as Admin
2. **Expo Go on Phone** → Login as Pastry Chef or Barista

---

## 🔄 Method 4: Logout and Switch

1. Click logout in the app
2. Login with different credentials
3. Repeat as needed

**Note**: This only lets you test one user at a time.

---

## 🎯 Testing Scenarios

### Scenario 1: Admin + Pastry Chef
- **Window 1**: Admin creates an order
- **Window 2**: Pastry Chef sees the order and marks it as "In Progress"

### Scenario 2: All Three Roles
- **Window 1**: Admin manages signup keys
- **Window 2**: Pastry Chef fulfills orders
- **Window 3**: Barista marks orders as picked up

### Scenario 3: Multiple Pastry Chefs
- Create additional pastry chef accounts via signup
- Test with multiple workers viewing the same orders

---

## 💡 Pro Tips

1. **Use Incognito Windows** - Easiest way to test multiple users
2. **Arrange Windows Side-by-Side** - See all users at once
3. **Use Different Browser Profiles** - If you need persistent sessions
4. **Clear Storage** - If you need to reset, clear browser storage (F12 → Application → Clear Storage)

---

## 🔐 Quick Reference

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@lumiere.com` | `admin123` |
| Pastry Chef | `pastry@lumiere.com` | `pastry123` |
| Barista | `barista@lumiere.com` | `barista123` |

---

## 🚀 Recommended Setup

**For Best Testing Experience:**

1. **Regular Window** → Admin (for managing system)
2. **Incognito Window 1** → Pastry Chef (for order fulfillment)
3. **Incognito Window 2** → Barista (for customer pickup)

This lets you test the full workflow:
- Admin creates/manages
- Pastry Chef prepares orders
- Barista handles pickup

---

**Last Updated**: November 29, 2025


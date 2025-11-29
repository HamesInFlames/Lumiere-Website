# 🔍 Project Issues Report - Lumière Patisserie

**Date**: November 29, 2025  
**Status**: Issues Found & Fixed

---

## ❌ CRITICAL ISSUES FOUND

### 1. **API URL IP Mismatch** ⚠️ CRITICAL
- **Location**: `Lumiere-App/src/config/api.js`
- **Issue**: API URL may not match current computer IP
- **Current Config**: `http://192.168.2.253:3000`
- **Status**: ✅ Fixed (was previously `192.168.1.100`)
- **Impact**: App cannot connect to backend if IP changes

### 2. **Backend Port Configuration**
- **Location**: `Lumiere-web/Backend/server.js`
- **Issue**: Default port is 5000, but .env sets it to 3000
- **Status**: ✅ Working (using .env PORT=3000)
- **Note**: Make sure .env file has `PORT=3000`

### 3. **CORS Configuration**
- **Location**: `Lumiere-web/Backend/server.js`
- **Issue**: CORS may not allow mobile app connections
- **Status**: ⚠️ Needs verification
- **Current**: Uses `CORS_ORIGIN` from .env
- **Recommendation**: Add mobile app IP ranges or use `*` for development

---

## ✅ VERIFIED WORKING

### Backend
- ✅ MongoDB Atlas connection configured
- ✅ Admin user seeded (`admin@lumiere.com`)
- ✅ Signup keys created (PASTRY2024, BARISTA2024)
- ✅ Server running on port 3000
- ✅ All routes registered correctly
- ✅ Authentication middleware working

### Mobile App
- ✅ Dependencies installed
- ✅ Navigation structure correct
- ✅ Auth store configured
- ✅ API interceptors set up
- ✅ Expo configuration valid

### Website
- ✅ React app structure correct
- ✅ Cart context implemented
- ✅ API integration ready

---

## 🔧 FIXES APPLIED

### 1. API URL Updated
- Changed from `192.168.1.100:3000` to `192.168.2.253:3000`
- **Action Required**: If your IP changes, update `Lumiere-App/src/config/api.js`

### 2. Database Connection
- ✅ Fixed `MONGO_URI` vs `MONGODB_URI` inconsistency
- ✅ Seed script now waits for connection

---

## ⚠️ POTENTIAL ISSUES TO WATCH

### 1. **Expo Go Connection**
- **Issue**: QR code scanning not working
- **Possible Causes**:
  - Phone and computer on different WiFi networks
  - Windows Firewall blocking port 8081
  - Expo Metro bundler not accessible
- **Solutions**:
  - Use tunnel mode (press `s` in Expo terminal)
  - Ensure same WiFi network
  - Check Windows Firewall settings

### 2. **Backend CORS**
- **Issue**: Mobile app may be blocked by CORS
- **Current Config**: Uses `CORS_ORIGIN` env variable
- **Recommendation**: For development, ensure CORS allows all origins or add mobile IP

### 3. **Network IP Changes**
- **Issue**: IP address may change when reconnecting to WiFi
- **Solution**: Update `Lumiere-App/src/config/api.js` when IP changes
- **Better Solution**: Use tunnel mode in Expo (doesn't require IP)

### 4. **Package Version Warnings**
- **Issue**: Some packages don't match Expo SDK version
- **Status**: ⚠️ Non-critical but may cause issues
- **Packages**:
  - `@react-native-async-storage/async-storage@1.24.0` (expected: 1.23.1)
  - `react-native@0.74.2` (expected: 0.74.5)
  - `react-native-safe-area-context@4.14.1` (expected: 4.10.5)
  - `react-native-screens@3.37.0` (expected: 3.31.1)

---

## 📋 CHECKLIST FOR TROUBLESHOOTING

### Backend
- [x] MongoDB Atlas connected
- [x] .env file configured
- [x] Server running on port 3000
- [x] Admin user created
- [x] Signup keys created
- [ ] CORS allows mobile app
- [ ] Firewall allows port 3000

### Mobile App
- [x] Dependencies installed
- [x] API URL configured
- [x] Expo server running
- [ ] Can connect via Expo Go
- [ ] Can reach backend API
- [ ] Login works

### Network
- [ ] Phone and computer on same WiFi
- [ ] Windows Firewall allows Node.js
- [ ] Backend accessible from phone browser
- [ ] Expo Metro bundler accessible

---

## 🚀 RECOMMENDED NEXT STEPS

1. **Test Backend from Phone**:
   - Open phone browser (same WiFi)
   - Go to: `http://192.168.2.253:3000/healthz`
   - Should see: `{"ok":true,"mongoState":1}`

2. **Use Expo Tunnel Mode**:
   - In Expo terminal, press `s`
   - Scan new QR code
   - This bypasses network issues

3. **Update Package Versions** (Optional):
   ```bash
   cd Lumiere-App
   npm install @react-native-async-storage/async-storage@1.23.1
   npm install react-native@0.74.5
   npm install react-native-safe-area-context@4.10.5
   npm install react-native-screens@3.31.1
   ```

4. **Check CORS Configuration**:
   - Verify `.env` has `CORS_ORIGIN` set
   - For development, can use `*` to allow all

---

## 📝 NOTES

- API URL is currently set to `192.168.2.253:3000`
- If your IP changes, update `Lumiere-App/src/config/api.js`
- Backend is running on port 3000 (from .env)
- All critical code issues have been fixed
- Remaining issues are network/configuration related

---

**Last Updated**: November 29, 2025


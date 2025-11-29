# 🔧 Web Version Troubleshooting Guide

## Current Status
- ✅ Web dependencies installed (`react-dom`, `react-native-web`)
- ⚠️ Web server not starting properly

## Step-by-Step Troubleshooting

### Step 1: Check Expo Terminal
Look at the terminal where you ran `npm start`. You should see:
- A QR code
- Options like "Press w │ open web"
- "Metro waiting on exp://..."

**If you see this:**
- Press `w` in that terminal
- Wait for it to say "Starting Web..."
- It should open automatically

### Step 2: Manual URL Access
If pressing `w` doesn't work, try accessing these URLs directly:

1. **Metro Bundler**: `http://localhost:8081`
   - This shows the Expo manifest (JSON)
   - If this works, Metro is running

2. **Web App**: `http://localhost:19006`
   - This should show the actual app
   - If you get "connection refused", the web server isn't starting

### Step 3: Check for Errors
Look in the Expo terminal for:
- Red error messages
- "Failed to compile"
- "Cannot find module"
- Port conflicts

### Step 4: Try Clearing Cache
```bash
cd Lumiere-App
npx expo start --clear
```

Then press `w` for web.

### Step 5: Check if Ports are in Use
```powershell
# Check if ports are in use
netstat -ano | findstr ":8081"
netstat -ano | findstr ":19006"
```

If something is using these ports, stop it first.

### Step 6: Install Expo CLI Globally (if needed)
```bash
npm install -g expo-cli
```

### Step 7: Alternative - Use Expo Dev Tools
1. Start Expo: `npm start`
2. When you see the QR code, look for a URL like:
   - `http://localhost:19000` (Expo Dev Tools)
3. Open that in browser
4. Click "Open in web browser" button

## Common Issues

### Issue: "Connection Refused"
**Cause**: Web server isn't starting
**Fix**: 
- Make sure `react-dom` and `react-native-web` are installed
- Try `npm run web` directly
- Check for port conflicts

### Issue: "Cannot find module"
**Cause**: Missing dependencies
**Fix**:
```bash
npm install
npm install react-dom react-native-web --legacy-peer-deps
```

### Issue: "Port already in use"
**Cause**: Another process using the port
**Fix**:
```powershell
# Find and kill process on port 19006
netstat -ano | findstr ":19006"
# Note the PID, then:
taskkill /PID <PID> /F
```

### Issue: App loads but shows blank screen
**Cause**: JavaScript errors
**Fix**:
- Open browser console (F12)
- Check for errors
- Look at Expo terminal for compilation errors

## Quick Test Without Web

If web version keeps failing, you can still test:

1. **Use Expo Go on phone** (if you can get it working)
2. **Test the backend API directly**:
   ```bash
   # Test login endpoint
   curl http://localhost:3000/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"email\":\"admin@lumiere.com\",\"password\":\"admin123\"}"
   ```
3. **Use Postman/Thunder Client** to test API endpoints

## Next Steps

1. **Check the Expo terminal** - What do you see?
2. **Try pressing 'w'** - Does it show any errors?
3. **Check browser console** (F12) - Any JavaScript errors?
4. **Share the error messages** - I can help fix specific issues

---

**Last Updated**: November 29, 2025


# 🔧 Expo Go Connection Troubleshooting

## ❌ Problem: QR Code Scan Not Working

If scanning the QR code with Expo Go doesn't work, try these solutions:

---

## ✅ Solution 1: Use Tunnel Mode (Recommended)

Tunnel mode works even if your phone and computer are on different networks!

1. **In the Expo terminal**, press `s` to switch to tunnel mode
2. Wait for a new QR code to appear
3. **Scan the new QR code** with Expo Go
4. This uses Expo's servers to connect, so it works from anywhere

---

## ✅ Solution 2: Check Same WiFi Network

1. **On your computer**, check your IP:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" under your WiFi adapter (should be like `192.168.x.x`)

2. **On your phone**, check WiFi settings:
   - Make sure you're connected to the **same WiFi network** as your computer
   - Not on mobile data!

3. **Try scanning the QR code again**

---

## ✅ Solution 3: Manually Enter URL in Expo Go

If scanning doesn't work, manually enter the URL:

1. Open **Expo Go** app on your phone
2. Tap **"Enter URL manually"** (or similar option)
3. Enter: `exp://192.168.2.253:8081`
   - Replace `192.168.2.253` with your computer's IP if different
4. Tap **"Connect"**

---

## ✅ Solution 4: Check Windows Firewall

Windows Firewall might be blocking the connection:

1. Open **Windows Defender Firewall**
2. Click **"Allow an app through firewall"**
3. Find **Node.js** and make sure both **Private** and **Public** are checked
4. If Node.js isn't listed, click **"Allow another app"** and add it

**Or temporarily disable firewall** to test (remember to re-enable after!)

---

## ✅ Solution 5: Use Web Version (Quick Test)

If you just want to test the app quickly:

1. In the Expo terminal, press `w` to open in web browser
2. This will open the app in your computer's browser
3. Note: Some mobile-specific features won't work, but you can test the UI

---

## ✅ Solution 6: Check Backend Connection

Make sure your backend is running and accessible:

1. **Check backend is running:**
   ```powershell
   # Should return status 200
   Invoke-WebRequest http://localhost:3000/healthz
   ```

2. **Test from your phone's browser:**
   - Open browser on phone (same WiFi network)
   - Go to: `http://192.168.2.253:3000/healthz`
   - Should see: `{"ok":true,"mongoState":1}`
   - If this doesn't work, the backend isn't accessible from your phone

3. **If backend isn't accessible:**
   - Check Windows Firewall (see Solution 4)
   - Make sure backend is running on port 3000
   - Check that CORS allows your phone's IP

---

## 🔍 Common Error Messages

### "Unable to connect to Metro bundler"
- **Fix**: Use tunnel mode (press `s` in Expo terminal)

### "Network request failed"
- **Fix**: Check WiFi connection, try tunnel mode

### "Connection timeout"
- **Fix**: Check firewall, ensure backend is running

### "Expo Go can't find the project"
- **Fix**: Make sure you're scanning the correct QR code from the Expo terminal

---

## 📱 Testing Steps

1. ✅ Backend running on `http://localhost:3000`
2. ✅ Expo server running (showing QR code)
3. ✅ Phone and computer on same WiFi (or use tunnel mode)
4. ✅ Windows Firewall allows Node.js
5. ✅ Scan QR code or manually enter URL
6. ✅ App should load in Expo Go

---

## 🚀 Quick Commands

**Switch to tunnel mode:**
- Press `s` in Expo terminal

**Reload app:**
- Press `r` in Expo terminal
- Or shake phone and tap "Reload"

**Open in web browser:**
- Press `w` in Expo terminal

**Show all commands:**
- Press `?` in Expo terminal

---

## 💡 Pro Tips

1. **Tunnel mode is most reliable** - works even on different networks
2. **Keep Expo terminal open** - closing it stops the server
3. **Check Expo terminal for errors** - it shows connection issues
4. **Restart Expo server** if stuck: Press `Ctrl+C`, then `npm start` again

---

**Still not working?** Check the Expo terminal for specific error messages and share them!


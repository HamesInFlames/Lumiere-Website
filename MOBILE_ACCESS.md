# 📱 Accessing Website on Your Phone

## Quick Setup

### Your Network Info
- **Local IP Address**: `192.168.2.103`
- **Website Port**: `8000`
- **Backend Port**: `3000`

---

## Steps to Access

### 1. Start Backend Server
```bash
cd Lumiere-web/Backend
npm run dev
```

The backend will start on `http://0.0.0.0:3000` (accessible from all network interfaces)

### 2. Start Website Dev Server
```bash
cd Lumiere-web/App
npm run dev
```

The website will start on `http://0.0.0.0:8000`

### 3. Connect Your Phone

1. **Make sure your phone is on the SAME Wi-Fi network** as your computer
2. **Open a browser** on your phone (Chrome, Safari, etc.)
3. **Navigate to**: `http://192.168.2.103:8000`

---

## Troubleshooting

### Can't Connect?

#### Check Windows Firewall
If your phone can't connect, Windows Firewall might be blocking:

1. Open **Windows Defender Firewall**
2. Click **Allow an app or feature through Windows Firewall**
3. Find **Node.js** and make sure both **Private** and **Public** are checked
4. If Node.js isn't listed, click **Allow another app** and add it

#### Verify Network Connection
- Both devices must be on the **same Wi-Fi network**
- Check your phone's Wi-Fi settings to confirm

#### Check IP Address
If `192.168.2.103` doesn't work, find your current IP:
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" }
```

#### Verify Servers Are Running
- Backend should show: `✅ Lumière API running on http://localhost:3000`
- Website should show: `Local: http://localhost:8000/`
- Both should also show network URLs

---

## Configuration Details

### Backend (`server.js`)
- ✅ Listens on `0.0.0.0` (all network interfaces)
- ✅ CORS allows local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
- ✅ Port: `3000` (matches Vite proxy)

### Website (`vite.config.js`)
- ✅ `host: true` (allows external connections)
- ✅ Port: `8000`
- ✅ Proxy configured for `/api` → `http://localhost:3000`

---

## Notes

- The website will proxy API calls to the backend automatically
- Both servers must be running for full functionality
- If you change networks, your IP address will change
- For production, use a proper domain and HTTPS

---

**Last Updated**: Based on IP `192.168.2.103`


# 🖥️ Terminal Management Guide

## 📋 Current Services Status

### ✅ Running
- **Backend API**: `http://localhost:3000` (Port 3000)

### ❌ Not Running
- **Frontend Website**: Not detected
- **Mobile App (Expo)**: Not detected

---

## 🔍 How to Identify Terminals

### Method 1: Check Window Title
Look at the PowerShell window title bar. It usually shows the current directory.

### Method 2: Check Current Directory
In each terminal, run:
```powershell
pwd
```

This will show:
- `Lumiere-web\Backend` = Backend server
- `Lumiere-web\App` = Frontend website
- `Lumiere-App` = Mobile app

### Method 3: Check Running Process
Run this in each terminal to see what's running:
```powershell
Get-Process | Where-Object { $_.ProcessName -eq "node" } | Select-Object Id, @{Name="Path";Expression={(Get-WmiObject Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine}}
```

---

## 🏷️ How to Rename PowerShell Windows

### Option 1: Change Window Title (Temporary)
Run this in each terminal:

**Backend Terminal:**
```powershell
$host.ui.RawUI.WindowTitle = "🔧 BACKEND - Port 3000"
```

**Frontend Terminal:**
```powershell
$host.ui.RawUI.WindowTitle = "🌐 FRONTEND - Port 5173"
```

**Mobile App Terminal:**
```powershell
$host.ui.RawUI.WindowTitle = "📱 MOBILE APP - Expo"
```

### Option 2: Use Different Terminal Colors
You can't change colors in standard PowerShell, but you can use Windows Terminal with different profiles.

---

## 🚀 Starting Services in Named Terminals

### Terminal 1: Backend
```powershell
cd C:\Users\xoxok\Downloads\LUMIERE_WEB_MAIN\Lumiere-web\Backend
$host.ui.RawUI.WindowTitle = "🔧 BACKEND - Port 3000"
npm run dev
```

### Terminal 2: Frontend Website
```powershell
cd C:\Users\xoxok\Downloads\LUMIERE_WEB_MAIN\Lumiere-web\App
$host.ui.RawUI.WindowTitle = "🌐 FRONTEND - Port 5173"
npm run dev
```

### Terminal 3: Mobile App
```powershell
cd C:\Users\xoxok\Downloads\LUMIERE_WEB_MAIN\Lumiere-App
$host.ui.RawUI.WindowTitle = "📱 MOBILE APP - Expo"
npm start
```

---

## 🛑 Stopping Services

### Stop Backend
Press `Ctrl+C` in the backend terminal, or:
```powershell
Get-Process | Where-Object { $_.Path -like "*Backend*" -and $_.CommandLine -like "*server.js*" } | Stop-Process
```

### Stop Frontend
Press `Ctrl+C` in the frontend terminal

### Stop Expo
Press `Ctrl+C` in the Expo terminal, or press `q` in the Expo menu

---

## 📝 Quick Reference

| Service | Directory | Port | Command |
|---------|-----------|------|---------|
| Backend | `Lumiere-web\Backend` | 3000 | `npm run dev` |
| Frontend | `Lumiere-web\App` | 5173 | `npm run dev` |
| Mobile App | `Lumiere-App` | Metro | `npm start` |

---

## 🔗 URLs

- **Backend API**: http://localhost:3000
- **Backend Health**: http://localhost:3000/healthz
- **Frontend**: http://localhost:5173 (when running)
- **Expo DevTools**: Opens automatically when Expo starts

---

**Tip**: Keep this guide open and use the window titles to quickly identify which terminal is which!


# 🚀 MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email (or use Google/GitHub)
3. Verify your email

## Step 2: Create Free Cluster

1. After login, click **"Build a Database"**
2. Choose **FREE** tier (M0 Sandbox)
3. Select **Cloud Provider & Region:**
   - Choose closest to you (e.g., `AWS`, `US East`)
   - Example cluster name: `lumiere-web-cluster`
4. Click **"Create"** (takes 3-5 minutes)

## Step 3: Create Database User

1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - **Username:** `Dev` (initial for development)
   - **Password:** IIbopkPblxcwtk6l (save it!)
5. Set privileges: **"Atlas admin"** (or "Read and write to any database")
6. Click **"Add User"**

## Step 4: Whitelist IP Address

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. For development:
   - Click **"Add Current IP Address"**
   - Or click **"Allow Access from Anywhere"** (0.0.0.0/0) - less secure but easier for testing
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Go to **"Database"** (left sidebar) or click **"Connect"** button on your cluster
2. You'll see a modal with connection options
3. **IMPORTANT:** Click **"Drivers"** under **"Connect to your application"** section
   - ⚠️ Do NOT choose Compass, Shell, or VS Code (those are for different tools)
   - ✅ Choose "Drivers" - this gives you the connection string for Node.js
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string (it will look like):
   ```
   mongodb+srv://<username>:<password>@lumiere-web-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<username>` with your database username (e.g., `lumiere-admin`)
   - Replace `<password>` with your database password

## Step 6: Update Your .env File

1. In `Lumiere-web/Backend/`, create `.env` file (copy from `.env.example`)
2. Replace the connection string:
   ```env
   MONGODB_URI=mongodb+srv://lumiere-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/lumiere?retryWrites=true&w=majority
   ```
   - Replace `YOUR_PASSWORD` with your actual password
   - Replace `cluster0.xxxxx` with your actual cluster name
   - The `/lumiere` at the end is your database name

## Step 7: Test Connection

```powershell
cd C:\Users\xoxok\Downloads\LUMIERE_WEB_MAIN\Lumiere-web\Backend
npm run seed:admin
```

Should see:
```
✅ Admin user created: admin@lumiere.com
✅ Pastry chef signup key created: PASTRY2024
✅ Barista signup key created: BARISTA2024
```

## Step 8: Start Your Backend

```powershell
npm run dev
```

Should see:
```
✅ Lumière API running on http://localhost:3000
```

No more MongoDB connection errors! 🎉

---

## 🔒 Security Best Practices

### For Production:
1. **Never commit `.env` file** to Git
2. **Use environment variables** in your hosting platform
3. **Restrict IP access** to only your server IPs
4. **Use strong passwords** for database users
5. **Enable MongoDB Atlas encryption** at rest

### For Deployment (Heroku/Railway/Render):
1. Add `MONGODB_URI` as environment variable in your platform
2. Remove IP whitelist restriction (or add platform IPs)
3. Use production JWT_SECRET

---

## 📊 Free Tier Limits

- **Storage:** 512 MB (plenty for development)
- **RAM:** Shared
- **Backups:** Automatic (7-day retention)
- **Perfect for:** Development and small production apps

---

## 🆘 Troubleshooting

**Connection Timeout:**
- Check IP whitelist includes your IP
- Check firewall isn't blocking

**Authentication Failed:**
- Verify username/password in connection string
- Check user has correct permissions

**Database Not Found:**
- Database is created automatically on first write
- Or create manually in Atlas UI

---

**That's it! You're ready to deploy! 🚀**


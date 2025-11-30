# 🔧 MongoDB Connection Troubleshooting

## Quick Fixes

### ✅ Fixed Issues
1. **Connection string format** - Ensured it's on one line
2. **Error messages** - Added helpful troubleshooting tips
3. **Connection timeouts** - Added proper timeout settings

---

## Common Connection Errors

### 1. "MongoServerError: bad auth"
**Problem**: Wrong username or password

**Solution**:
- Check MongoDB Atlas → Database Access
- Verify username and password match your .env file
- Make sure password doesn't have special characters that need encoding

---

### 2. "MongoServerSelectionError: connection timed out"
**Problem**: IP address not whitelisted

**Solution**:
1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Wait 1-2 minutes for changes to take effect
5. Restart your backend server

---

### 3. "MongoParseError: Invalid connection string"
**Problem**: Connection string format issue

**Solution**:
- Ensure connection string is on **ONE line** in .env
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- No line breaks or extra spaces

---

### 4. "MongoNetworkError: getaddrinfo ENOTFOUND"
**Problem**: Can't resolve MongoDB hostname

**Solution**:
- Check internet connection
- Verify connection string hostname is correct
- Try pinging: `ping lumiere-web-cluster.g73jwih.mongodb.net`

---

## Verify Your Setup

### Check .env File
```bash
cd Lumiere-web/Backend
# Make sure MONGODB_URI is set and on one line
```

Your connection string should look like:
```
MONGODB_URI=mongodb+srv://dev:IIbopkPblxcwtk6l@lumiere-web-cluster.g73jwih.mongodb.net/lumiere?retryWrites=true&w=majority
```

### Test Connection
1. Restart backend server:
   ```bash
   cd Lumiere-web/Backend
   npm run dev
   ```

2. Look for these messages:
   - ✅ `MongoDB connected successfully` - Working!
   - ❌ `MongoDB connection error` - See error message above

---

## MongoDB Atlas Checklist

- [ ] Cluster is created and running
- [ ] Database user is created (username: `dev`)
- [ ] Password is correct
- [ ] IP address is whitelisted (Network Access)
- [ ] Connection string copied correctly
- [ ] Connection string is on one line in .env

---

## Still Not Working?

1. **Check MongoDB Atlas Status**
   - Go to MongoDB Atlas dashboard
   - Verify cluster is running (green status)

2. **Test Connection String**
   - Copy connection string from Atlas
   - Make sure it includes database name: `/lumiere`
   - Test in MongoDB Compass or online connection tester

3. **Check Firewall/Antivirus**
   - Some firewalls block MongoDB connections
   - Temporarily disable to test

4. **Verify Environment Variables**
   ```bash
   # In backend directory
   node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
   ```

---

**Last Updated**: After fixing connection string format


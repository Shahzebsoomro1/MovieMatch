# 🚀 Quick Fix Guide - Get MovieMatch Running

## Issue Summary

Your project has **3 main issues** preventing it from running:

1. **MongoDB is not running** (CRITICAL - blocks server startup)
2. **TMDb API key is a placeholder** (WARNING - movie features won't work)
3. **Cloudinary credentials are placeholders** (INFO - image uploads won't work)

---

## ✅ Fix #1: MongoDB (REQUIRED)

### Option A: Start MongoDB Locally

**Check if MongoDB is installed:**
```powershell
mongod --version
```

**If installed, start it:**
```powershell
# As Windows Service (if installed as service)
net start MongoDB

# Or manually (find your data directory)
mongod --dbpath "C:\data\db"
```

**If not installed:**
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Edition
3. Start the service

### Option B: Use MongoDB Atlas (EASIER - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster (M0 - Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/moviematch?retryWrites=true&w=majority
   ```
   (Replace username, password, and cluster URL with your actual values)

---

## ✅ Fix #2: TMDb API Key (REQUIRED for movie features)

1. Go to https://www.themoviedb.org/
2. Create a free account
3. Go to Settings → API → Request API Key
4. Choose "Developer" → Fill form → Get API Key
5. Update `backend/.env`:
   ```
   TMDB_API_KEY=your_actual_api_key_from_tmdb
   ```

---

## ✅ Fix #3: Cloudinary (OPTIONAL - only if you need image uploads)

1. Go to https://cloudinary.com/users/register/free
2. Create a free account
3. Go to Dashboard → Copy credentials
4. Update `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

**Note**: The app will run without Cloudinary, but image uploads won't work.

---

## 🧪 Test Your Setup

### Test MongoDB Connection:
```powershell
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => { console.log('✅ MongoDB Connected!'); process.exit(0); }).catch(err => { console.log('❌ Error:', err.message); process.exit(1); });"
```

### Test Backend Server:
```powershell
cd backend
npm run dev
```

**Expected output:**
```
MongoDB Connected: ...
Server running on port 5000
```

### Test Frontend Server:
```powershell
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🎯 Running the Application

### Terminal 1 - Backend:
```powershell
cd backend
npm run dev
```

### Terminal 2 - Frontend:
```powershell
cd frontend
npm run dev
```

### Open Browser:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## ❌ Common Errors & Solutions

### Error: "MongoDB connection: FAILED"
**Solution**: MongoDB is not running. See Fix #1 above.

### Error: "ECONNREFUSED"
**Solution**: MongoDB service is not started. Start it or use MongoDB Atlas.

### Error: "TMDB_API_KEY is invalid"
**Solution**: Get a real API key from themoviedb.org (Fix #2).

### Error: "Port 5000 already in use"
**Solution**: 
- Change PORT in `backend/.env` to another port (e.g., 5001)
- Or stop the process using port 5000:
  ```powershell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### Error: "Port 5173 already in use"
**Solution**: Vite will automatically use the next available port, or manually change it in `vite.config.js`.

---

## 📋 Checklist

- [ ] MongoDB is running (local or Atlas)
- [ ] `backend/.env` has valid MONGO_URI
- [ ] `backend/.env` has valid TMDB_API_KEY
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can access http://localhost:5000/api/health

---

## 🆘 Still Having Issues?

1. Check `ISSUES_FOUND.md` for detailed problem analysis
2. Check backend console for error messages
3. Check frontend browser console (F12) for errors
4. Verify all environment variables are set correctly
5. Make sure Node.js v18+ is installed: `node --version`

---

**Once all fixes are applied, your MovieMatch app should be running! 🎬**

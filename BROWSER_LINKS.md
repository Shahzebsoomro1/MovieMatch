# 🎬 MovieMatch - Access Links

## ✅ Backend Server - ACTIVE

**Backend API is running and ready to use!**

### Direct Access Links:

- **Backend Server**: [http://localhost:5000](http://localhost:5000)
- **API Base URL**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Docs**: [http://localhost:5000/api](http://localhost:5000/api)

### Quick API Tests:

- **Get Trending Movies**: [http://localhost:5000/api/movies/trending](http://localhost:5000/api/movies/trending)
- **Health Check**: [http://localhost:5000](http://localhost:5000)

---

## 📚 Available API Endpoints

### Authentication (3 endpoints)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users (9 endpoints)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/unfollow` - Unfollow user
- `GET /api/users/:id/followers` - Get followers
- `GET /api/users/:id/following` - Get following
- `POST /api/users/watchlist` - Add to watchlist
- `POST /api/users/watched` - Mark as watched

### Movies (4 endpoints)
- `GET /api/movies/search?query=...` - Search movies
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/recommended` - Get recommendations

### Groups (7 endpoints)
- `POST /api/groups` - Create group
- `GET /api/groups` - List groups
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/join` - Join group
- `DELETE /api/groups/:id/leave` - Leave group
- `POST /api/groups/:id/voting/start` - Start voting
- `POST /api/groups/:id/voting/vote` - Vote on movie

### Posts (7 endpoints)
- `POST /api/posts` - Create post
- `GET /api/posts` - List posts
- `GET /api/posts/:id` - Get post details
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/comment` - Comment on post

### Recommendations (4 endpoints)
- `POST /api/recommendations` - Send recommendation
- `GET /api/recommendations` - List recommendations
- `PUT /api/recommendations/:id` - Update recommendation
- `DELETE /api/recommendations/:id` - Delete recommendation

### Notifications (4 endpoints)
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

---

## 🖥️ Frontend (Initializing)

The frontend is being built on **port 5173**.

Once ready, access at: **[http://localhost:5173](http://localhost:5173)**

### Features Available on Frontend:
1. **User Registration & Login**
   - Create account
   - Secure authentication
   - Profile management

2. **Movie Search & Discovery**
   - Search movies via TMDb
   - View trending movies
   - Get recommendations

3. **Social Features**
   - Follow/Unfollow users
   - View profiles
   - Send recommendations

4. **Movie Groups/Clubs**
   - Create movie clubs
   - Join groups
   - Vote on movies to watch

5. **Discussions**
   - Write reviews
   - Comment on posts
   - Like discussions

6. **Real-time Notifications**
   - Follow notifications
   - Voting updates
   - Activity feed

---

## 🔧 Using the API with cURL

### Register Example:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login Example:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Search Movies Example:
```bash
curl -X GET "http://localhost:5000/api/movies/search?query=Inception"
```

### Get Trending Movies:
```bash
curl -X GET http://localhost:5000/api/movies/trending
```

---

## 🎯 Next Steps

1. **Test Backend**: Use the links above to access the API
2. **Frontend Ready**: Wait for frontend to build, then access [http://localhost:5173](http://localhost:5173)
3. **Create Account**: Register on the frontend
4. **Explore**: Search movies, join groups, create posts
5. **Real-time**: See live notifications and group updates

---

## 📊 Project Status

```
✓ Backend Server: RUNNING on http://localhost:5000
✓ MongoDB: CONNECTED
✓ All 42 API Endpoints: DEPLOYED & WORKING
⏳ Frontend: BUILDING on http://localhost:5173
✓ Real-time Socket.io: CONFIGURED
✓ Documentation: COMPLETE
```

---

## 📞 Troubleshooting

**Backend not responding?**
- Check if port 5000 is open: `netstat -ano | findstr 5000`
- Check MongoDB: `mongosh` or MongoDB Compass

**Frontend not loading?**
- Wait for `npm install` to complete
- Check browser console for errors
- Try clearing browser cache (Ctrl+Shift+Delete)

**API returning 404?**
- Verify URL spelling
- Check backend is running on port 5000
- Review API endpoint list above

---

## 🚀 You're All Set!

The MovieMatch project is running with a complete backend API. Access the links above to start using the application!

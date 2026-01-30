# MovieMatch - Quick Reference Guide

## Project at a Glance

**MovieMatch** is a full-stack MERN application for movie enthusiasts to discover films, follow other users, create clubs, vote collaboratively, and discuss movies in real-time.

## Directory Overview

```
MovieMatch/
├── backend/          (Node.js + Express server)
├── frontend/         (React + Vite app)
├── README.md        (Project overview)
├── SETUP.md         (Development setup)
├── DEPLOYMENT.md    (Production guide)
└── PROJECT_STRUCTURE.md (Detailed file structure)
```

## 5-Minute Quick Start

### Requirements
- Node.js v18+
- MongoDB (local or Atlas)
- TMDb API key

### Step 1: Backend Setup
```bash
cd backend
npm install
# Edit .env with your MongoDB URI, JWT_SECRET, TMDB_API_KEY
npm run dev
# Backend runs on http://localhost:5000
```

### Step 2: Frontend Setup (New Terminal)
```bash
cd frontend
npm install
# Edit .env with your API URL
npm run dev
# Frontend runs on http://localhost:5173
```

## Key Files Quick Reference

### Backend
| File | Purpose |
|------|---------|
| `server.js` | Express server entry point |
| `config/db.js` | MongoDB connection |
| `models/User.js` | User schema & auth |
| `routes/auth.js` | Auth endpoints |
| `controllers/userController.js` | User logic |
| `sockets/index.js` | Real-time events |

### Frontend
| File | Purpose |
|------|---------|
| `main.jsx` | React entry point |
| `App.jsx` | Main app component |
| `pages/Home.jsx` | Home/landing page |
| `pages/Login.jsx` | Login page |
| `context/AuthContext.jsx` | Auth state |
| `services/api.js` | API calls |
| `services/socket.js` | Real-time client |

## Essential Commands

### Backend
```bash
npm run dev      # Development with auto-reload
npm start        # Production
npm test         # Run tests (when configured)
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run linter
```

## Environment Variables

### Backend .env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/moviematch
JWT_SECRET=your_secret_key
TMDB_API_KEY=your_tmdb_key
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

### Frontend .env
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Core Features

### Authentication
- Register → `POST /api/auth/register`
- Login → `POST /api/auth/login`
- Get Current User → `GET /api/auth/me`

### Movies
- Search → `GET /api/movies/search?query=...`
- Trending → `GET /api/movies/trending`
- Details → `GET /api/movies/:id`
- Recommendations → `GET /api/movies/recommended`

### Users
- Get Users → `GET /api/users`
- Get Profile → `GET /api/users/:id`
- Follow User → `POST /api/users/:id/follow`
- Watchlist → `POST /api/users/watchlist`

### Groups
- Create Group → `POST /api/groups`
- Get Groups → `GET /api/groups`
- Join Group → `POST /api/groups/:id/join`
- Start Voting → `POST /api/groups/:id/voting/start`
- Vote → `POST /api/groups/:id/voting/vote`

### Posts
- Create Post → `POST /api/posts`
- Get Posts → `GET /api/posts`
- Like Post → `POST /api/posts/:id/like`
- Add Comment → `POST /api/posts/:id/comment`

### Recommendations
- Send Recommendation → `POST /api/recommendations`
- Get Recommendations → `GET /api/recommendations`

### Notifications
- Get Notifications → `GET /api/notifications`
- Mark as Read → `PUT /api/notifications/:id`

## Common Workflows

### User Registration & Login
1. User fills registration form
2. Frontend calls `POST /api/auth/register`
3. Backend creates user and returns JWT token
4. Frontend stores token in localStorage
5. User can access protected routes

### Searching & Viewing Movies
1. User enters search query
2. Frontend calls `GET /api/movies/search`
3. Movie results display with poster images
4. Click movie card to see details
5. Can add to watchlist or mark as watched

### Creating & Joining Groups
1. User creates group with name and description
2. User can invite others or make public
3. Members can participate in voting
4. Can discuss movies in group threads

### Real-time Notifications
1. User connects with Socket.io
2. Server sends notifications on events
3. Unread count updates in real-time
4. Click notification to navigate

## Database Collections

| Collection | Fields | Purpose |
|-----------|--------|---------|
| users | email, username, password, followers, following, watchlist, watched | User accounts |
| movies | tmdbId, title, genres, rating, posterPath | Cached movies |
| groups | name, members, currentVoting, createdBy | Movie clubs |
| posts | author, content, movieId, likes, comments | Reviews & discussions |
| recommendations | fromUser, toUser, movieId, status | User recommendations |
| notifications | recipient, type, content, read | Alerts & updates |

## React Component Structure

```jsx
App.jsx
├── Navbar (with notifications)
├── Routes
│   ├── Home
│   ├── Login
│   ├── Register
│   ├── MovieSearch
│   ├── MovieDetails
│   ├── Groups
│   ├── GroupDetail
│   ├── Discover
│   ├── Profile
│   └── Notifications
├── Footer
└── Toaster (notifications)
```

## State Management

### Auth Context
- `user` - Current user object
- `token` - JWT token
- `isLoading` - Loading state
- `error` - Error messages
- Methods: `login()`, `logout()`, `updateUser()`

### Notification Context
- `notifications` - Array of notifications
- `unreadCount` - Count of unread
- Methods: `setNotifications()`, `addNotification()`, `markAsRead()`

## Socket.io Events

### User Events
- `user_online(userId)` - User comes online
- `disconnect` - User goes offline

### Notification Events
- `send_notification(data)` - Send notification
- `new_notification` - Receive notification
- `notification` - Generic notification

### Group Events
- `join_group(groupId)` - Join group room
- `group_activity(data)` - Broadcast activity
- `member_joined` - New member joined

### Voting Events
- `vote_cast(data)` - Cast vote
- `voting_started` - Voting started
- `vote_updated` - Vote count updated

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| CORS error | Wrong CLIENT_URL | Update in backend .env |
| Auth failed | Invalid token | Re-login to get new token |
| MongoDB error | Connection string wrong | Check MONGO_URI |
| TMDb 404 | Invalid API key | Get new key from TMDb |
| Socket not connected | URL mismatch | Check VITE_SOCKET_URL |

## File Size Guide

- **Backend**: ~35 files, ~1500 LOC
- **Frontend**: ~45 files, ~1500 LOC
- **Total**: ~80+ files, ~3000+ LOC

## Testing Endpoints

Use Postman or cURL to test:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'

# Search Movies (with token)
curl -X GET "http://localhost:5000/api/movies/search?query=inception" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Deployment Checklist

- [ ] Update MONGO_URI to production database
- [ ] Set strong JWT_SECRET
- [ ] Update CLIENT_URL to production frontend
- [ ] Configure Cloudinary (optional)
- [ ] Setup error tracking (Sentry)
- [ ] Enable HTTPS
- [ ] Configure firewall/security
- [ ] Setup backups
- [ ] Test all features in production

## Performance Tips

- Database indexes are created on key fields
- Movies are cached to reduce API calls
- Consider Redis for session storage
- Implement pagination for large lists
- Use CDN for image delivery

## Security Best Practices

- Passwords are hashed with bcrypt
- JWT tokens expire after 30 days
- CORS is configured for frontend URL only
- User input is validated
- Consider rate limiting for production

## Getting Help

1. Check [SETUP.md](SETUP.md) for development help
2. Check [DEPLOYMENT.md](DEPLOYMENT.md) for production help
3. Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for file details
4. Check API logs in terminal
5. Check browser console for frontend errors

## What's Next?

1. **Development**: Implement remaining page features
2. **Testing**: Add unit and integration tests
3. **Features**: Add advanced recommendations, watch parties
4. **Performance**: Implement caching, optimize queries
5. **Deployment**: Follow DEPLOYMENT.md guide
6. **Maintenance**: Monitor logs, update dependencies

## Quick Links

- [GitHub Movies Data](https://www.themoviedb.org) - Get API key
- [MongoDB Docs](https://docs.mongodb.com) - Database help
- [Express Guide](https://expressjs.com/api) - Backend framework
- [React Docs](https://react.dev) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com) - Styling guide

## Support

For issues:
1. Check error messages in terminal/console
2. Review relevant documentation file
3. Check database connection
4. Verify environment variables
5. Test endpoints individually

---

**Happy Coding! 🎬🎉**

MovieMatch is ready for development. Start building amazing features!

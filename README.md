# MovieMatch - Social Movie Recommendation Platform

A full-featured MERN stack application for discovering, sharing, and discussing movies with a community of film enthusiasts.

## Features

### MVP Features (Phase 1)
- ✅ User Authentication (Register, Login, Logout)
- ✅ User Profiles with Preferences
- ✅ Movie Search & Details (TMDb API)
- ✅ Follow/Unfollow Users
- ✅ Watchlist & Watched Lists
- ✅ Basic Recommendations
- ✅ Create & Join Groups
- ✅ Group Voting System
- ✅ Discussion Threads & Comments

### Advanced Features (Phase 2)
- Real-time Notifications (Socket.io)
- Advanced Recommendation Algorithm
- User Activity Feed
- Movie Ratings & Reviews
- Search Filters & Sorting
- Trending Movies
- User Statistics Dashboard

### Nice-to-Have Features (Phase 3)
- Direct Messaging
- Movie Watch Parties
- Achievement Badges
- Email Notifications
- Dark Mode
- Mobile App (React Native)

## Tech Stack

### Frontend
- React 18.2+
- Vite (Build tool)
- React Router v6
- Tailwind CSS
- Axios
- Socket.io-client
- React Hook Form
- Framer Motion

### Backend
- Node.js v18+
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.io
- Cloudinary (Image Storage)
- TMDb API

## Project Structure

```
MovieMatch/
├── backend/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── sockets/
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── services/
    │   ├── hooks/
    │   ├── utils/
    │   ├── styles/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── .env
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- TMDb API Key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure `.env` file with your values:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/moviematch
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
TMDB_API_KEY=your_tmdb_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/unfollow` - Unfollow user
- `GET /api/users/:id/followers` - Get user's followers
- `GET /api/users/:id/following` - Get user's following

### Movies
- `GET /api/movies/search` - Search movies
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/recommended` - Get personalized recommendations

### Groups
- `POST /api/groups` - Create new group
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/join` - Join group
- `DELETE /api/groups/:id/leave` - Leave group
- `POST /api/groups/:id/voting/start` - Start voting
- `POST /api/groups/:id/voting/vote` - Vote on movie

### Posts (Discussions)
- `POST /api/posts` - Create post
- `GET /api/posts` - Get posts
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/comment` - Add comment

### Recommendations
- `POST /api/recommendations` - Send recommendation
- `GET /api/recommendations` - Get recommendations
- `PUT /api/recommendations/:id` - Update recommendation status
- `DELETE /api/recommendations/:id` - Delete recommendation

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Database Collections

See [Database Design section in guide](./docs/DATABASE.md) for detailed schema information.

## Real-time Features (Socket.io)

- User online/offline status
- Live notifications
- Group activity updates
- Voting updates
- Typing indicators
- Direct messaging

## Environment Variables

### Backend
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/moviematch
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### Frontend
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

Your Name & Development Team

## Support

For support, email support@moviematch.com or open an issue on GitHub.

## Acknowledgments

- TMDb API for movie data
- Cloudinary for image hosting
- Socket.io for real-time features
- Tailwind CSS for styling

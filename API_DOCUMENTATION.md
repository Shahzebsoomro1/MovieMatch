# MovieMatch API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-url/api
```

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require authentication.

Headers:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

## Success Response Format
```json
{
  "success": true,
  "data": {}
}
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```
**Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": "https://..."
  }
}
```

### Login User
```http
POST /auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": "https://..."
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": "https://...",
    "followers": [],
    "following": [],
    "watchlist": [],
    "watched": []
  }
}
```

---

## User Endpoints

### Get All Users (with search)
```http
GET /users?search=john
Authorization: Bearer <TOKEN>
```
**Query Parameters:**
- `search` (optional) - Search by username or email

**Response:**
```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "profilePicture": "https://...",
      "followers": [],
      "following": []
    }
  ]
}
```

### Get User by ID
```http
GET /users/:id
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "bio": "Movie enthusiast",
    "profilePicture": "https://...",
    "preferences": {
      "favoriteGenres": ["Action", "Drama"],
      "favoriteActors": ["Tom Hanks"],
      "favoriteDirectors": ["Steven Spielberg"]
    },
    "followers": [],
    "following": [],
    "totalMoviesWatched": 42,
    "totalReviews": 8
  }
}
```

### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <TOKEN>
```
**Body:**
```json
{
  "username": "john_updated",
  "bio": "Updated bio",
  "profilePicture": "https://...",
  "preferences": {
    "favoriteGenres": ["Action", "SciFi"],
    "favoriteActors": ["Tom Cruise"],
    "favoriteDirectors": ["Christopher Nolan"]
  },
  "isPrivate": false
}
```
**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

### Follow User
```http
POST /users/:id/follow
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "message": "User followed successfully"
}
```

### Unfollow User
```http
DELETE /users/:id/unfollow
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "message": "User unfollowed successfully"
}
```

### Get User's Followers
```http
GET /users/:id/followers
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "followers": [
    {
      "id": "507f1f77bcf86cd799439012",
      "username": "jane_doe",
      "profilePicture": "https://...",
      "bio": "Movie lover"
    }
  ]
}
```

### Get User's Following
```http
GET /users/:id/following
Authorization: Bearer <TOKEN>
```
**Response:** Similar to followers

### Add Movie to Watchlist
```http
POST /users/watchlist
Authorization: Bearer <TOKEN>
```
**Body:**
```json
{
  "movieId": 550
}
```
**Response:**
```json
{
  "success": true,
  "watchlist": [
    {
      "movieId": 550,
      "addedAt": "2024-01-26T10:30:00Z"
    }
  ]
}
```

### Remove Movie from Watchlist
```http
DELETE /users/watchlist/:movieId
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "watchlist": []
}
```

### Mark Movie as Watched
```http
POST /users/watched
Authorization: Bearer <TOKEN>
```
**Body:**
```json
{
  "movieId": 550,
  "rating": 9
}
```
**Response:**
```json
{
  "success": true,
  "watched": [
    {
      "movieId": 550,
      "watchedAt": "2024-01-26T10:30:00Z",
      "rating": 9
    }
  ]
}
```

---

## Movie Endpoints

### Search Movies
```http
GET /movies/search?query=inception&page=1
Authorization: Bearer <TOKEN>
```
**Query Parameters:**
- `query` - Search term
- `page` (optional) - Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "page": 1,
  "results": [
    {
      "id": 27205,
      "title": "Inception",
      "overview": "...",
      "poster_path": "/...",
      "release_date": "2010-07-16",
      "vote_average": 8.8
    }
  ],
  "total_pages": 5,
  "total_results": 100
}
```

### Get Trending Movies
```http
GET /movies/trending?timeWindow=week
Authorization: Bearer <TOKEN>
```
**Query Parameters:**
- `timeWindow` - 'day' or 'week' (default: week)

**Response:**
```json
{
  "success": true,
  "results": [ ... ]
}
```

### Get Movie Details
```http
GET /movies/:id
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "movie": {
    "id": "507f1f77bcf86cd799439011",
    "tmdbId": 27205,
    "title": "Inception",
    "overview": "...",
    "posterPath": "/...",
    "backdropPath": "/...",
    "releaseDate": "2010-07-16",
    "genres": ["Action", "Sci-Fi"],
    "runtime": 148,
    "voteAverage": 8.8
  }
}
```

### Get Personalized Recommendations
```http
GET /movies/recommended
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "movieId": 550,
      "count": 5,
      "avgRating": 8.2
    }
  ]
}
```

---

## Group Endpoints

### Create Group
```http
POST /groups
Authorization: Bearer <TOKEN>
```
**Body:**
```json
{
  "name": "Action Movie Enthusiasts",
  "description": "A group for action movie lovers",
  "isPrivate": false,
  "maxMembers": 50
}
```
**Response:**
```json
{
  "success": true,
  "group": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Action Movie Enthusiasts",
    "description": "...",
    "createdBy": "507f1f77bcf86cd799439012",
    "members": [
      {
        "userId": "507f1f77bcf86cd799439012",
        "role": "admin",
        "joinedAt": "2024-01-26T10:30:00Z"
      }
    ],
    "currentVoting": {
      "isActive": false,
      "movies": [],
      "endsAt": null
    }
  }
}
```

### Get All Groups
```http
GET /groups?search=action
Authorization: Bearer <TOKEN>
```
**Query Parameters:**
- `search` (optional) - Search group name

**Response:**
```json
{
  "success": true,
  "count": 3,
  "groups": [ ... ]
}
```

### Get Group by ID
```http
GET /groups/:id
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "group": { ... }
}
```

### Join Group
```http
POST /groups/:id/join
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "message": "Joined group successfully"
}
```

### Leave Group
```http
DELETE /groups/:id/leave
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "message": "Left group successfully"
}
```

### Start Voting
```http
POST /groups/:id/voting/start
Authorization: Bearer <TOKEN>
```
**Body:**
```json
{
  "movies": [550, 27205, 278],
  "duration": 60
}
```
**Response:**
```json
{
  "success": true,
  "message": "Voting started",
  "voting": {
    "isActive": true,
    "movies": [
      {
        "movieId": 550,
        "votes": [],
        "voteCount": 0
      }
    ],
    "endsAt": "2024-01-26T11:30:00Z"
  }
}
```

### Vote on Movie
```http
POST /groups/:id/voting/vote
Authorization: Bearer <TOKEN>
```
**Body:**
```json
{
  "movieId": 550
}
```
**Response:**
```json
{
  "success": true,
  "message": "Vote recorded",
  "voting": { ... }
}
```

---

## Post Endpoints

### Create Post
```http
POST /posts
Authorization: Bearer <TOKEN>
```
**Body:**
```json
{
  "movieId": 550,
  "content": "This movie is amazing!",
  "type": "review",
  "rating": 9
}
```
**Response:**
```json
{
  "success": true,
  "post": {
    "id": "507f1f77bcf86cd799439011",
    "author": { ... },
    "movieId": 550,
    "content": "This movie is amazing!",
    "type": "review",
    "rating": 9,
    "likes": [],
    "likeCount": 0,
    "comments": [],
    "commentCount": 0,
    "createdAt": "2024-01-26T10:30:00Z"
  }
}
```

### Get Posts
```http
GET /posts?movieId=550&type=review&page=1
Authorization: Bearer <TOKEN>
```
**Query Parameters:**
- `movieId` (optional)
- `type` (optional) - 'review', 'discussion', 'recommendation'
- `page` (optional)

**Response:**
```json
{
  "success": true,
  "posts": [ ... ]
}
```

### Get Post by ID
```http
GET /posts/:id
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "post": { ... }
}
```

### Update Post
```http
PUT /posts/:id
Authorization: Bearer <TOKEN>
```
**Body:**
```json
{
  "content": "Updated content",
  "rating": 8
}
```
**Response:**
```json
{
  "success": true,
  "post": { ... }
}
```

### Delete Post
```http
DELETE /posts/:id
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "message": "Post deleted"
}
```

### Like Post
```http
POST /posts/:id/like
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "post": { ... },
  "liked": true
}
```

### Add Comment
```http
POST /posts/:id/comment
Authorization: Bearer <TOKEN>
```
**Body:**
```json
{
  "content": "Great review!"
}
```
**Response:**
```json
{
  "success": true,
  "post": { ... }
}
```

---

## Recommendation Endpoints

### Send Recommendation
```http
POST /recommendations
Authorization: Bearer <TOKEN>
```
**Body:**
```json
{
  "toUserId": "507f1f77bcf86cd799439012",
  "movieId": 550,
  "reason": "Based on your taste",
  "personalNote": "You'll love this one!"
}
```
**Response:**
```json
{
  "success": true,
  "recommendation": {
    "id": "507f1f77bcf86cd799439011",
    "fromUser": "507f1f77bcf86cd799439011",
    "toUser": "507f1f77bcf86cd799439012",
    "movieId": 550,
    "reason": "Based on your taste",
    "personalNote": "You'll love this one!",
    "status": "pending",
    "createdAt": "2024-01-26T10:30:00Z"
  }
}
```

### Get Recommendations
```http
GET /recommendations?status=pending
Authorization: Bearer <TOKEN>
```
**Query Parameters:**
- `status` - 'pending', 'accepted', 'watched', 'ignored'

**Response:**
```json
{
  "success": true,
  "count": 3,
  "recommendations": [ ... ]
}
```

### Update Recommendation Status
```http
PUT /recommendations/:id
Authorization: Bearer <TOKEN>
```
**Body:**
```json
{
  "status": "watched"
}
```
**Response:**
```json
{
  "success": true,
  "recommendation": { ... }
}
```

### Delete Recommendation
```http
DELETE /recommendations/:id
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "message": "Recommendation deleted"
}
```

---

## Notification Endpoints

### Get Notifications
```http
GET /notifications?unreadOnly=false
Authorization: Bearer <TOKEN>
```
**Query Parameters:**
- `unreadOnly` - 'true' or 'false' (default: false)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "notifications": [
    {
      "id": "507f1f77bcf86cd799439011",
      "recipient": "507f1f77bcf86cd799439011",
      "sender": {
        "id": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "profilePicture": "https://..."
      },
      "type": "follow",
      "content": "jane_doe started following you",
      "link": "/profile/507f1f77bcf86cd799439012",
      "read": false,
      "createdAt": "2024-01-26T10:30:00Z"
    }
  ]
}
```

### Mark Notification as Read
```http
PUT /notifications/:id
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "notification": { ... }
}
```

### Mark All Notifications as Read
```http
PUT /notifications/read-all
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### Delete Notification
```http
DELETE /notifications/:id
Authorization: Bearer <TOKEN>
```
**Response:**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Not permitted |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error |

## Rate Limiting

Currently not implemented. Recommended for production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

## Pagination

Endpoints with large datasets support pagination:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

## Filtering & Sorting

Supported on list endpoints:
- Filter by various fields
- Sort by creation date, relevance, etc.

---

This API documentation is complete and covers all 42 endpoints implemented in MovieMatch!

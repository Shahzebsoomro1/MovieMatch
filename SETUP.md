# MovieMatch Development Setup Guide

## Initial Setup (First Time)

### 1. Prerequisites Installation
- Install Node.js v18+ from [nodejs.org](https://nodejs.org)
- Install MongoDB Community Edition or use MongoDB Atlas
- Get TMDb API Key from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file with required variables (see Environment Variables section)

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file with required variables

## Running the Application

### Start MongoDB (if using local installation)
```bash
mongod
```

### Terminal 1 - Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### Terminal 2 - Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Common Commands

### Backend
- `npm run dev` - Start with nodemon (hot reload)
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- For MongoDB Atlas, ensure IP whitelist includes your machine

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Vite will automatically use next available port

### CORS Errors
- Ensure CLIENT_URL in backend .env matches frontend URL
- Check Socket.io CORS configuration

### API Key Issues
- Verify TMDb API key is valid and active
- Check API rate limits

## Deployment

See [Deployment Guide](./DEPLOYMENT.md) for production deployment instructions.

## Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Socket.io Documentation](https://socket.io/docs)

## Next Steps

1. Create database indexes (see backend/models for indexes)
2. Set up Cloudinary for image uploads
3. Configure email service (currently placeholder)
4. Implement missing page components
5. Add comprehensive error handling
6. Write unit and integration tests
7. Set up CI/CD pipeline

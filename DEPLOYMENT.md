# Deployment Guide for MovieMatch

## Deployment Architecture

```
Frontend → Vercel (or Netlify)
Backend → Render, Railway, or Heroku
Database → MongoDB Atlas
Storage → Cloudinary
```

## Frontend Deployment (Vercel)

### 1. Build the Frontend
```bash
cd frontend
npm run build
```

### 2. Connect to Vercel
- Go to [vercel.com](https://vercel.com)
- Sign in with GitHub account
- Import the MovieMatch repository
- Set environment variables in Vercel dashboard:
  ```
  VITE_API_URL=https://your-backend-url/api
  VITE_SOCKET_URL=https://your-backend-url
  ```
- Deploy

## Backend Deployment (Render)

### 1. Prepare Backend
- Create `Procfile` in backend root:
  ```
  web: node server.js
  ```

### 2. Deploy to Render
- Go to [render.com](https://render.com)
- Connect GitHub account
- Create new Web Service
- Select MovieMatch repository
- Set build command: `cd backend && npm install`
- Set start command: `cd backend && node server.js`
- Add environment variables:
  ```
  NODE_ENV=production
  MONGO_URI=your_mongodb_atlas_uri
  JWT_SECRET=your_secure_secret
  TMDB_API_KEY=your_api_key
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  CLIENT_URL=https://your-frontend-url
  ```
- Deploy

## Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Sign up or sign in
- Create new project

### 2. Create Cluster
- Select free tier
- Choose region closest to your users
- Create cluster

### 3. Setup Security
- Add IP whitelist (allow all for now, restrict in production)
- Create database user with strong password
- Get connection string

### 4. Connect Your App
- Update MONGO_URI in production environment:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/moviematch
  ```

## DNS & Domain Setup

### If Using Custom Domain
1. Purchase domain from registrar (GoDaddy, Namecheap, etc.)
2. Update nameservers to point to Vercel
3. Add domain in Vercel dashboard
4. Update API URL in frontend environment variables

## Environment Variables Checklist

### Production Backend (.env)
- [ ] NODE_ENV=production
- [ ] PORT=configured by host
- [ ] MONGO_URI=MongoDB Atlas connection string
- [ ] JWT_SECRET=strong random string
- [ ] JWT_EXPIRE=30d
- [ ] TMDB_API_KEY=valid API key
- [ ] CLOUDINARY_CLOUD_NAME=your account
- [ ] CLOUDINARY_API_KEY=your key
- [ ] CLOUDINARY_API_SECRET=your secret
- [ ] CLIENT_URL=your production frontend URL

### Production Frontend (.env)
- [ ] VITE_API_URL=your production backend URL
- [ ] VITE_SOCKET_URL=your production backend URL

## Pre-Deployment Checklist

### Security
- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS everywhere
- [ ] Update CORS settings (whitelist specific domains)
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Remove console.logs from production code

### Performance
- [ ] Optimize images
- [ ] Enable gzip compression
- [ ] Setup database indexes
- [ ] Configure caching headers
- [ ] Monitor API response times

### Testing
- [ ] Test all authentication flows
- [ ] Test API endpoints
- [ ] Test real-time features
- [ ] Test on different browsers
- [ ] Load testing (if applicable)

### Monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Configure logging
- [ ] Setup uptime monitoring
- [ ] Monitor database usage
- [ ] Track API usage

## Post-Deployment

### 1. Database Migrations
```bash
# Create indexes
# Run from MongoDB shell or compass
use moviematch;
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.movies.createIndex({ tmdbId: 1 }, { unique: true });
db.posts.createIndex({ movieId: 1 });
db.posts.createIndex({ author: 1 });
db.notifications.createIndex({ recipient: 1, read: 1 });
```

### 2. Verify Deployment
- [ ] Test login/registration
- [ ] Test movie search
- [ ] Test real-time features
- [ ] Check error logs
- [ ] Monitor performance

### 3. Backup Strategy
- [ ] Enable MongoDB automated backups
- [ ] Test restore procedures
- [ ] Document backup location

## Scaling Considerations

### When Ready to Scale
- Implement caching (Redis)
- Setup load balancing
- Optimize database queries
- Implement pagination
- Setup CDN for static files
- Consider microservices architecture

## Maintenance

### Regular Tasks
- Monitor error logs daily
- Check API rate limits
- Review user feedback
- Update dependencies monthly
- Test backup restoration quarterly

### Updates
```bash
# Update dependencies
npm update

# Security updates
npm audit fix
```

## Support & Troubleshooting

### Common Deployment Issues

**Issue: CORS errors after deployment**
- Solution: Update CLIENT_URL in backend environment variables

**Issue: Images not loading**
- Solution: Ensure Cloudinary credentials are correct

**Issue: Database connection timeout**
- Solution: Check MongoDB Atlas IP whitelist and connection string

**Issue: Socket.io not connecting**
- Solution: Ensure CORS is properly configured and URLs match

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

# 🚀 Deploy to Render

## Prerequisites
1. **GitHub Account** - Push your code to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas** - Cloud database (or any MongoDB provider)
4. **Environment Variables** - Have all your secrets ready

## 📋 Step-by-Step Deployment

### 1. Push to GitHub
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Connect to your GitHub repo
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### 2. Create Render Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure deployment:

**Basic Settings:**
- **Name**: `vercel-ecom` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `cd server && npm ci && npm run render-build`
- **Start Command**: `cd server && npm start`

### 3. Set Environment Variables
In Render dashboard, go to **Environment** tab and add:

**Required Variables:**
```
NODE_ENV=production
PORT=10000
MONGO_DBURL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
SECRET_KEY=your_jwt_secret_key_here
CLIENT_URL=https://your-render-app.onrender.com
```

**Firebase Variables:**
```
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Email Variables (Choose one):**

**Option A: Gmail OAuth2**
```
GMAIL_USER=your-gmail@gmail.com
GMAIL_CLIENT_ID=your-oauth-client-id
GMAIL_CLIENT_SECRET=your-oauth-client-secret  
GMAIL_REFRESH_TOKEN=your-refresh-token
```

**Option B: SMTP**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
SMTP_FROM="Your Store <noreply@yourstore.com>"
```

### 4. Deploy
1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Monitor the build logs for any errors
4. Once deployed, you'll get a URL like: `https://your-app.onrender.com`

## 🔧 Alternative: Manual Environment Setup

If you prefer manual setup instead of `render.yaml`:

1. **Don't use render.yaml**
2. **Manually configure** in Render dashboard:
   - Build Command: `cd server && npm ci && npm run render-build`
   - Start Command: `cd server && npm start`
   - Add all environment variables manually

## 📝 Important Notes

**Client URL Configuration:**
- After deployment, update `CLIENT_URL` to your Render app URL
- Update Firebase Auth domains to include your Render domain

**Database:**
- Use MongoDB Atlas (free tier available)
- Whitelist Render's IP (or use 0.0.0.0/0 for all IPs)

**Build Process:**
- Server installs dependencies
- Client builds and creates `/dist` folder  
- Server serves client from `../client/dist`

**Logs & Debugging:**
- Check Render logs for build/runtime errors
- Test email functionality after deployment
- Verify all API endpoints work

## 🌟 Post-Deployment Checklist
- [ ] App loads successfully
- [ ] Authentication works
- [ ] Database connections established  
- [ ] Email service functional
- [ ] Admin panel accessible
- [ ] Payment flow working
- [ ] All environment variables set correctly

## 🆘 Troubleshooting

**Build Fails:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs for specific errors

**Runtime Errors:**
- Verify environment variables
- Check MongoDB connection string
- Ensure Firebase credentials are correct

**Email Issues:**
- Test with `/api/common/email-test` endpoint
- Verify SMTP/Gmail OAuth2 settings
- Check email service logs

---
Your full-stack e-commerce app will be live at: `https://your-app.onrender.com` 🎉
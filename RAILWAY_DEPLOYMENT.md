# 🚂 Railway Deployment Guide - Easiest Way!

## Why Railway?
- ✅ Deploys in 5 minutes
- ✅ Free $5 credit per month (plenty for your app)
- ✅ No complex configuration
- ✅ Auto-deploys from GitHub
- ✅ HTTPS included
- ✅ Easy environment variables

---

## 🚀 Step-by-Step Deployment (5 Minutes!)

### Step 1: Sign Up for Railway (1 minute)
1. Go to: https://railway.app
2. Click **"Login"** or **"Start a New Project"**
3. Sign in with **GitHub** (recommended)
4. Authorize Railway to access your repositories

### Step 2: Create New Project (1 minute)
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select: `feedback-evaluation-system`
4. Railway will ask: "Which directory?" → Select **`server`**

### Step 3: Configure Service (2 minutes)

#### A. Set Environment Variables (IMPORTANT!)
1. Click on your deployed service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add:

```
OPENAI_API_KEY=sk-your-actual-openai-key-here
OPENAI_MODEL=gpt-4o-mini
PORT=8787
```

4. Click **"Add"** after each variable

#### B. Configure Build Settings
1. Go to **"Settings"** tab
2. Under **"Build"** section:
   - **Build Command**: Leave empty (Railway auto-detects)
   - **Start Command**: `node server.js`
   - **Root Directory**: `server`

### Step 4: Generate Public URL (30 seconds)
1. Still in **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Railway gives you a URL like: `https://feedback-backend-production-abc123.up.railway.app`
5. **Copy this entire URL!** (You'll need it for next step)

### Step 5: Deploy
1. Click **"Deploy"** button (if not auto-deployed)
2. Wait 1-2 minutes
3. Check **"Deployments"** tab - should show "Success" ✅

---

## ✅ Test Your Backend

Before connecting frontend, test if backend works:

### Method 1: Browser Test
1. Open your Railway URL in browser
2. Add `/api/health` to the end
3. Example: `https://your-app.up.railway.app/api/health`
4. You should see: `{"ok":true,"ai":true}`

### Method 2: PowerShell Test
```powershell
# Replace with your Railway URL
$url = "https://your-app.up.railway.app"

# Test health endpoint
Invoke-RestMethod "$url/api/health"

# Test chat endpoint
$body = @{
    messages = @(
        @{ role = "user"; content = "Hello" }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "$url/api/chat" -Method Post -Body $body -ContentType "application/json"
```

If you see responses, your backend is working! 🎉

---

## 🔧 Connect Frontend to Railway Backend

I'll update your Chatbot.jsx to use Railway backend:

### Manual Steps:
1. Open: `src/components/Chatbot.jsx`
2. Find line ~88 (the commented code section)
3. **Uncomment** the async function (lines 88-123)
4. **Update line 106** with your Railway URL:

```javascript
// Change this line:
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';

// To this (replace with your actual Railway URL):
const apiUrl = 'https://your-app.up.railway.app';
```

5. **Comment out or remove** line 86:
```javascript
// Remove these lines:
// const fallback = getBotReply(text);
// setMessages((prev) => [...prev, { sender: 'bot', text: fallback, ts: Date.now() }]);
```

### Then Deploy:
```powershell
npm run build
git add -A
git commit -m "feat: connect chatbot to Railway backend"
git push origin main
```

---

## 💰 Cost & Limits

**Railway Free Tier:**
- ✅ $5 credit per month
- ✅ Your app uses ~$0.50-2/month
- ✅ Auto-sleeps after 30min inactivity (wakes up instantly on request)
- ✅ 500 hours/month execution time (plenty!)

**OpenAI Costs:**
- gpt-4o-mini: ~$0.15 per 1M tokens
- 100 chats/day ≈ $0.50-1/month
- Very affordable!

**Total: ~$1-3/month** (well within free tier!)

---

## 🔄 Auto-Deploy

**Best feature:** Railway auto-deploys when you push to GitHub!

1. Make changes to `server/server.js`
2. `git push origin main`
3. Railway automatically rebuilds and redeploys
4. No manual work needed!

---

## 🐛 Troubleshooting

### "Service failed to deploy"
- Check **"Build Logs"** tab for errors
- Make sure `server/server.js` exists
- Verify all dependencies in `server/package.json`

### "502 Bad Gateway"
- Wait 1 minute (service might be waking up from sleep)
- Check environment variables are set correctly
- Look at **"Logs"** tab for errors

### "AI not configured" error
- Verify `OPENAI_API_KEY` is set in Variables tab
- Make sure key starts with `sk-`
- Check key is valid at https://platform.openai.com/api-keys

### CORS errors on frontend
- Your server already has CORS enabled (`cors({ origin: '*' })`)
- Make sure you're using the full Railway URL with `https://`
- Hard refresh browser (Ctrl+F5)

### Service keeps sleeping
- Free tier sleeps after 30min inactivity
- First request after sleep takes 5-10 seconds
- Upgrade to Hobby plan ($5/month) for always-on

---

## 📊 Monitor Your App

### View Logs:
1. Go to your Railway project
2. Click on service
3. Click **"Logs"** tab
4. See real-time logs of all requests

### View Metrics:
1. Click **"Metrics"** tab
2. See CPU, Memory, Network usage
3. Track request count

### View Deployments:
1. Click **"Deployments"** tab
2. See all past deployments
3. Can rollback to previous versions

---

## 🎯 Summary

**Railway vs AWS:**
| Feature | Railway | AWS Lambda |
|---------|---------|------------|
| Setup Time | 5 minutes | 30 minutes |
| Difficulty | ⭐ Easy | ⭐⭐⭐⭐⭐ Complex |
| Auto-deploy | ✅ Yes | ❌ No |
| HTTPS | ✅ Auto | ✅ Via API Gateway |
| Logs | ✅ Real-time | ❌ CloudWatch |
| Cost | $0-2/month | $0/month |

**Railway is clearly easier!** 🎉

---

## 🎓 Next Steps

1. ✅ Deploy backend on Railway (5 min)
2. ✅ Test `/api/health` endpoint
3. ✅ Update frontend with Railway URL
4. ✅ Build and deploy frontend
5. ✅ Test chatbot on your website!

**Need help?** Let me know your Railway URL and I'll help update the frontend code!

---

## 🔗 Useful Links

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Your Repo: https://github.com/saikumarpothuganti/feedback-evaluation-system
- Your Site: https://saikumarpothuganti.github.io/feedback-evaluation-system

Good luck! 🚀

# ⚠️ IMPORTANT: Update Railway URL

Before deploying, you need to update the chatbot with your Railway URL.

## Step 1: Get Your Railway URL
After deploying on Railway (Steps 3-7 in the main guide):
1. Go to Railway dashboard
2. Click on your service
3. Click "Settings" tab
4. Under "Networking", you'll see your URL
5. Copy it (like: `https://feedback-evaluation-system-production-abc123.up.railway.app`)

## Step 2: Update Chatbot.jsx
1. Open: `src/components/Chatbot.jsx`
2. Find line 96 (look for this):
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'https://YOUR-RAILWAY-URL.up.railway.app';
```

3. Replace `YOUR-RAILWAY-URL.up.railway.app` with your actual Railway URL

Example:
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'https://feedback-evaluation-system-production-abc123.up.railway.app';
```

## Step 3: Save and Continue
After updating, proceed with the deployment steps in the main guide.

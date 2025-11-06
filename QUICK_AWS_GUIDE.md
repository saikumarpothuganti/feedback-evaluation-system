# 🚀 Quick AWS Lambda Deployment Guide

## ✅ Files Ready
- ✅ `lambda-deployment.zip` - Your deployment package is ready!
- ✅ Located in project root

## 📋 Simple 6-Step Process

### Step 1: Get OpenAI API Key (5 minutes)
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-...`)
4. Save it somewhere safe!

### Step 2: Open AWS Lambda Console (1 minute)
1. Go to: https://console.aws.amazon.com/lambda
2. Sign in with your AWS account
3. Click **"Create function"** button

### Step 3: Configure Function (2 minutes)
Fill in these fields:
- **Function name**: `chatbot-backend`
- **Runtime**: `Node.js 20.x`
- **Architecture**: `x86_64`
- Click **"Create function"**

### Step 4: Upload Your Code (2 minutes)
1. Scroll down to **"Code source"** section
2. Click **"Upload from"** → **".zip file"**
3. Click **"Upload"** and select `lambda-deployment.zip`
4. Click **"Save"**

### Step 5: Configure Settings (3 minutes)

#### A. Set Environment Variable (IMPORTANT!)
1. Click **"Configuration"** tab
2. Click **"Environment variables"** in left sidebar
3. Click **"Edit"** → **"Add environment variable"**
4. Enter:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `your-openai-key-here` (from Step 1)
5. Click **"Save"**

#### B. Increase Timeout
1. Still in **"Configuration"** tab
2. Click **"General configuration"** in left sidebar
3. Click **"Edit"**
4. Set **Timeout**: `30 seconds`
5. Set **Memory**: `256 MB`
6. Click **"Save"**

### Step 6: Create API Gateway (3 minutes)
1. Go back to your Lambda function page
2. Click **"Add trigger"** button
3. Select **"API Gateway"**
4. Configure:
   - **API type**: `HTTP API`
   - **Security**: `Open`
5. Click **"Add"**

#### 🎉 Get Your API URL
1. After creating, look at **"Configuration"** → **"Triggers"**
2. You'll see the **API endpoint URL**
3. Copy it! (Example: `https://xyz123.execute-api.us-east-1.amazonaws.com/default/chatbot-backend`)

## 🔧 Update Your Frontend

Now that your backend is deployed, update your chatbot:

1. Open `src/components/Chatbot.jsx`
2. Find line ~88 (the commented code)
3. Uncomment lines 88-123
4. Update line 106 with your API URL:
```javascript
const apiUrl = 'YOUR-API-URL-HERE'; // Paste your API Gateway URL
const resp = await fetch(`${apiUrl}/api/chat`, {
```

5. Comment out or remove line 86:
```javascript
// const fallback = getBotReply(text);
// setMessages((prev) => [...prev, { sender: 'bot', text: fallback, ts: Date.now() }]);
```

6. Build and deploy:
```powershell
npm run build
git add -A
git commit -m "feat: connect chatbot to AWS Lambda"
git push origin main
```

## 🧪 Test Your Deployment

### Test in AWS Console:
1. Go to your Lambda function
2. Click **"Test"** tab
3. Click **"Create new event"**
4. Paste this:
```json
{
  "httpMethod": "POST",
  "path": "/api/chat",
  "body": "{\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}"
}
```
5. Click **"Test"**
6. You should see a response with AI text!

### Test on Your Website:
1. Wait 2 minutes for GitHub Pages to update
2. Visit: https://saikumarpothuganti.github.io/feedback-evaluation-system/
3. Click the chatbot icon 💬
4. Type "Hello"
5. You should get an AI response!

## 💰 Cost (FREE!)

**AWS Lambda Free Tier:**
- ✅ 1 million requests/month (FOREVER)
- ✅ Your app will use ~100-1000 requests/month
- ✅ **Cost: $0**

**OpenAI API:**
- gpt-4o-mini: ~$0.15 per 1M input tokens
- ~100 chats/day = ~3000 tokens = **~$0.50/month**
- Very affordable!

## 🐛 Troubleshooting

### "AI not configured" error
→ Check you added OPENAI_API_KEY in environment variables

### Function timeout
→ Increase timeout to 30 seconds in General configuration

### CORS errors
→ The code already has CORS enabled, try hard refresh (Ctrl+F5)

### Not getting responses
→ Check CloudWatch logs: Lambda → Monitor → View CloudWatch logs

## 📊 Monitor Usage

1. Go to Lambda → Your function → **"Monitor"** tab
2. See requests, duration, errors
3. Click **"View CloudWatch logs"** to see detailed logs

---

## 🎯 Summary

You now have:
- ✅ Serverless AI chatbot backend on AWS
- ✅ Completely FREE (within free tier)
- ✅ Scales automatically
- ✅ No server maintenance needed
- ✅ Available 24/7

**Total setup time: ~15 minutes**
**Monthly cost: ~$0 (AWS) + $0.50 (OpenAI)**

Congratulations! 🎉

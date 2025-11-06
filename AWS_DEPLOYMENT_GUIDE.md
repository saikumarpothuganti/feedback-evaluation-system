# AWS Lambda Deployment Guide

## Prerequisites
1. AWS Account (Free tier eligible)
2. OpenAI API Key (get from https://platform.openai.com/api-keys)

## Step 1: Install Dependencies Locally

```powershell
cd lambda
npm install
```

## Step 2: Create Deployment Package

```powershell
# Create a zip file with your code and dependencies
Compress-Archive -Path index.mjs, package.json, node_modules -DestinationPath lambda-deployment.zip
```

## Step 3: Create Lambda Function via AWS Console

### A. Go to AWS Lambda Console
1. Navigate to: https://console.aws.amazon.com/lambda
2. Click **"Create function"**

### B. Configure Function
- **Function name**: `chatbot-backend`
- **Runtime**: Node.js 20.x
- **Architecture**: x86_64
- **Permissions**: Create a new role with basic Lambda permissions

### C. Upload Code
1. In the **Code** tab, click **"Upload from"** → **".zip file"**
2. Upload `lambda-deployment.zip`
3. Click **"Save"**

### D. Configure Handler
1. Under **Runtime settings**, click **"Edit"**
2. Set **Handler** to: `index.handler`
3. Click **"Save"**

### E. Set Environment Variables
1. Go to **Configuration** → **Environment variables**
2. Click **"Edit"** → **"Add environment variable"**
3. Add:
   - Key: `OPENAI_API_KEY`
   - Value: `your-openai-api-key-here`
4. (Optional) Add:
   - Key: `OPENAI_MODEL`
   - Value: `gpt-4o-mini`
5. Click **"Save"**

### F. Adjust Timeout
1. Go to **Configuration** → **General configuration**
2. Click **"Edit"**
3. Set **Timeout** to: `30 seconds`
4. Set **Memory** to: `256 MB`
5. Click **"Save"**

## Step 4: Create API Gateway

### A. Add Trigger
1. In your Lambda function, click **"Add trigger"**
2. Select **"API Gateway"**

### B. Configure API Gateway
- **API type**: HTTP API
- **Security**: Open
- Click **"Add"**

### C. Get Your API URL
1. After creating, you'll see the API endpoint in the **Configuration** → **Triggers** section
2. Copy the URL (looks like: `https://abc123.execute-api.us-east-1.amazonaws.com/default/chatbot-backend`)

## Step 5: Update Frontend

### A. Update Chatbot.jsx
Uncomment the AI code and update the API URL:

```javascript
// Around line 106 in Chatbot.jsx
const apiUrl = 'https://YOUR-API-GATEWAY-URL.amazonaws.com/default/chatbot-backend';
const resp = await fetch(`${apiUrl}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: toAI, system }),
});
```

### B. Rebuild and Deploy
```powershell
npm run build
git add -A
git commit -m "feat: connect chatbot to AWS Lambda backend"
git push origin main
```

## Step 6: Test Your Deployment

1. Visit your GitHub Pages site
2. Open the chatbot
3. Type a message
4. You should get AI-powered responses!

## Monitoring & Debugging

### View Logs
1. Go to Lambda → Your function → **Monitor** tab
2. Click **"View CloudWatch logs"**
3. You'll see all requests and errors

### Test Function
1. In Lambda console, go to **Test** tab
2. Create test event:
```json
{
  "httpMethod": "POST",
  "path": "/api/chat",
  "body": "{\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}"
}
```
3. Click **"Test"** to see if it works

## Cost Estimation (Free Tier)

**AWS Lambda Free Tier (Forever):**
- ✅ 1 million requests per month
- ✅ 400,000 GB-seconds compute time

**Your Usage:**
- ~100ms per chat request
- Even with 10,000 chats/month = way under free tier!

**OpenAI Costs:**
- gpt-4o-mini: ~$0.15 per 1M input tokens
- ~1000 words = ~1300 tokens
- 10,000 chats ≈ $2-5/month (very affordable)

## Troubleshooting

### Error: "AI not configured"
- Make sure OPENAI_API_KEY is set in environment variables
- Check the key is valid at https://platform.openai.com/api-keys

### Error: "Task timed out"
- Increase timeout in Configuration → General configuration
- Set to 30 seconds

### Error: CORS issues
- The Lambda function already has CORS headers configured
- Make sure API Gateway has CORS enabled

### Function not responding
- Check CloudWatch logs for errors
- Test the function using the Test tab
- Verify the API Gateway trigger is active

## Alternative: Using AWS CLI (Advanced)

If you prefer command line:

```powershell
# Install AWS CLI
winget install Amazon.AWSCLI

# Configure
aws configure

# Create function
aws lambda create-function `
  --function-name chatbot-backend `
  --runtime nodejs20.x `
  --role arn:aws:iam::YOUR-ACCOUNT-ID:role/lambda-role `
  --handler index.handler `
  --zip-file fileb://lambda-deployment.zip `
  --timeout 30 `
  --memory-size 256

# Set environment variables
aws lambda update-function-configuration `
  --function-name chatbot-backend `
  --environment "Variables={OPENAI_API_KEY=your-key-here}"
```

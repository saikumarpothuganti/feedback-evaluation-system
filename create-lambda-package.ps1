# AWS Lambda Deployment Package Creator
# Run this script to create the deployment package

Write-Host "🚀 Creating AWS Lambda deployment package..." -ForegroundColor Cyan

# Navigate to lambda directory
Set-Location lambda

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Create deployment package
Write-Host "`n📦 Creating deployment zip..." -ForegroundColor Yellow

# Remove old zip if exists
if (Test-Path "lambda-deployment.zip") {
    Remove-Item "lambda-deployment.zip"
}

# Create zip file
Compress-Archive -Path index.mjs, package.json, node_modules -DestinationPath lambda-deployment.zip -Force

Write-Host "`n✅ Deployment package created: lambda-deployment.zip" -ForegroundColor Green
Write-Host "📦 Size: $((Get-Item lambda-deployment.zip).Length / 1MB) MB" -ForegroundColor Cyan

Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to AWS Lambda Console: https://console.aws.amazon.com/lambda"
Write-Host "2. Create a new function with Node.js 20.x runtime"
Write-Host "3. Upload the lambda-deployment.zip file"
Write-Host "4. Set handler to: index.handler"
Write-Host "5. Add environment variable: OPENAI_API_KEY"
Write-Host "6. Add API Gateway trigger"
Write-Host "`nSee AWS_DEPLOYMENT_GUIDE.md for detailed instructions`n"

# Return to project root
Set-Location ..

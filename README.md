# Frontend Repository

React + Vite frontend for Student Feedback Management System.

## Run locally

1. Install dependencies:
   npm install
2. Start dev server:
   npm run dev
3. Build for production:
   npm run build

## Docker

Build and run frontend container from this folder:

```
docker build -f Dockerfile.frontend -t feedback-frontend .
docker run -p 80:80 feedback-frontend
```

The Nginx config proxies /api calls to http://host.docker.internal:8080.
Update nginx/default.conf if your backend URL is different.

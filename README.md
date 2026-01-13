# 🤖 DocuMind AI – Smart Document Analyzer

DocuMind AI is an intelligent, AI-powered document analysis platform that helps you understand documents faster. Upload files, extract insights, generate summaries, and interact with your documents using natural language questions—all powered by state-of-the-art large language models.

## 🌟 Key Features

📂 Multi-format Support
PDF, DOCX, and TXT files
File size support up to 10MB

🧠 AI-Powered Analysis
Executive summaries

💬 Interactive Q&A
Ask natural language questions about your documents
Get accurate, context-aware answers

📧 Email Reports
Automatically receive document analysis via email
Ideal for sharing insights with teams or clients

## 🛠️ Tech Stack
Layer	Technology
🎨 Frontend	React 18
⚙️ Backend	Node.js + Express
🤖 AI Engine	Groq API (Llama 3.3-70B)
📧 Email	Nodemailer (Gmail SMTP)
🧩 Architecture Overview

Frontend: Upload documents, view summaries, ask questions
Backend API: Handles uploads, parsing, AI requests, and email delivery
AI Layer: Uses Groq-hosted LLMs for fast and accurate inference
Email Service: Sends structured reports directly to user inboxes

### 🚀 Deployment (100% Free, No Credit Card Required)
🔧 Backend Deployment → Koyeb

Visit 👉 https://koyeb.com
 and sign up with GitHub

Create App → Web Service → GitHub → Select this repository
Configure the service:
Work directory: backend
Run command: npm start
Port: 5000
Add the following environment variables:
GROQ_API_KEY
EMAIL_USER
EMAIL_PASSWORD
FRONTEND_URL
Deploy the service and copy your backend URL

🎨 Frontend Deployment → Vercel

Visit 👉 https://vercel.com
 and sign up with GitHub

Add New Project → Select this repository
Configure:
Root Directory: frontend
Framework Preset: Create React App
Add environment variable:
REACT_APP_API_URL=https://your-koyeb-url.koyeb.app/api

Deploy and copy your frontend URL

### 🔐 Update CORS Configuration
Open Koyeb Dashboard

Go to Settings → Environment Variables

Update:

FRONTEND_URL = https://your-vercel-app.vercel.app

Redeploy the backend

📦 Local Development Setup
# Backend
cd backend
npm install
npm run dev

# Frontend (in a separate terminal)
cd frontend
npm install
npm start

📄 License

This project is licensed under the MIT License.
You’re free to use, modify, and distribute it.

⭐ Why DocuMind AI?

Perfect for students, researchers, lawyers, and business analysts

No vendor lock-in – fully open-source

Uses cutting-edge LLMs with ultra-fast inference

Easy to deploy, scale, and customize

🤝 Contributing

Contributions are welcome!
Feel free to fork the repo, open issues, or submit pull requests.
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

📦 Local Development Setup
# Backend
cd backend
npm install
npm run dev

# Frontend (in a separate terminal)
cd frontend
npm install
npm start


⭐ Why DocuMind AI?

Perfect for students, researchers, lawyers, and business analysts
No vendor lock-in – fully open-source
Uses cutting-edge LLMs with ultra-fast inference
Easy to deploy, scale, and customize

🤝 Contributing

Contributions are welcome!
Feel free to fork the repo, open issues, or submit pull requests.
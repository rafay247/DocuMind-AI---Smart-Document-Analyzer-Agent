---

## **File 33: README.md**
````markdown
# 🤖 DocuMind AI - Smart Document Analyzer

![DocuMind AI](https://img.shields.io/badge/AI-Powered-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933)
![License](https://img.shields.io/badge/License-MIT-green)

An intelligent AI-powered document analyzer that extracts insights, generates summaries, and enables interactive Q&A with your documents.

---

## 🌟 Features

### 📄 Document Analysis
- **Multi-format Support**: PDF, DOCX, TXT files up to 10MB
- **Executive Summaries**: AI-generated comprehensive overviews
- **Key Points Extraction**: Automatic identification of main takeaways
- **Sentiment Analysis**: Understand the document's overall tone
- **Entity Recognition**: Extract names, dates, locations, organizations
- **Action Items**: Identify tasks and deadlines

### 💬 Interactive Q&A
- Ask natural language questions about your documents
- Context-aware responses using conversation history
- Real-time AI-powered answers

### 📧 Email Notifications
- Beautifully formatted HTML email reports
- Automatic delivery after analysis
- Comprehensive breakdown of insights

### 📊 Analysis History
- Store and access all past analyses
- Quick retrieval of previous documents
- Persistent storage

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **AI**: Groq API (Llama 3.3-70B)
- **File Processing**: pdf-parse, mammoth, multer
- **Email**: Nodemailer (Gmail SMTP)

### Frontend
- **Framework**: React 18
- **UI Components**: Custom components with React Hooks
- **File Upload**: react-dropzone
- **Notifications**: react-toastify
- **Icons**: react-icons
- **HTTP Client**: Axios

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Gmail account (for email notifications)
- Groq API key (free at https://console.groq.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/documind-ai.git
cd documind-ai
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your API keys
nano .env
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 4. Get API Keys

#### Groq API Key (FREE)
1. Visit: https://console.groq.com/
2. Sign up and create an API key
3. Add to `backend/.env`: `GROQ_API_KEY=your_key_here`

#### Gmail App Password
1. Enable 2FA: https://myaccount.google.com/security
2. Generate app password: https://myaccount.google.com/apppasswords
3. Add to `backend/.env`:
````
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_char_password
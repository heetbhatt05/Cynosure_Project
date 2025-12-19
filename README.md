# Cynosure_Project

**AI-assisted career guidance platform for Class 10–12 students built using the MERN stack.**

Cynosure is designed to help school students make clearer, more informed career decisions using structured inputs like personality-based quizzes, resume analysis, and AI-assisted guidance — instead of random or confusing advice.

---

## 🚀 Overview

Choosing a career is often overwhelming for students at the school level. Cynosure aims to simplify this process by combining:

* structured questionnaires
* resume-based context (optional)
* AI-powered analysis
* interactive career guidance through chat

The focus is on **clarity, responsibility, and practical guidance** suitable for young users.

---

## ✨ Key Features

* **Personality-based Quiz**
  Helps understand student interests, strengths, and preferences.

* **Resume Upload & Parsing (Optional)**
  Extracts relevant information to improve career recommendations.

* **AI-generated Career Report**
  Provides structured insights including possible career paths, skills to build, and next steps.

* **Career Guidance Chatbot**
  Allows students to ask follow-up questions about streams, courses, and long-term planning.

* **Safe & Student-focused Design**
  Avoids unsafe or speculative career suggestions and keeps guidance age-appropriate.

---

## 🛠 Tech Stack

**Frontend**

* React.js
* Zustand (state management)
* CSS

**Backend**

* Node.js
* Express.js
* MongoDB
* JWT-based Authentication

**AI Integration**

* External AI APIs (e.g., Perplexity-style chat completion) for analysis and chat-based guidance

---

## 📂 Project Structure (High Level)

```
Cynosure_Project/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── .gitignore
├── .env.example
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/your-username/Cynosure_Project.git
cd Cynosure_Project
```

> Replace `your-username` with your actual GitHub username.

---

### 2. Install dependencies

**Backend**

```
cd backend
npm install
```

**Frontend**

```
cd frontend
npm install
```

---

### 3. Environment variables

Create a `.env` file in the backend folder using `.env.example` as reference.

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_api_key
```

---

### 4. Run the project

**Backend**

```
npm run dev
```

**Frontend**

```
npm run dev
```

---

## 📌 Usage

1. Register or log in
2. Complete the personality-based quiz
3. Upload resume (optional)
4. View AI-generated career analysis
5. Use the chatbot for further career-related questions

---

## 🎯 Project Goals

* Provide **clear and structured career guidance** to school students
* Encourage **responsible use of AI** in education
* Build a **real-world full-stack application** using MERN
* Focus on **flows and system design**, not just individual features

---

## 📚 Learning Outcomes

* Full-stack MERN development
* API design and integration
* Authentication and authorization
* AI integration with structured prompts
* Building student-safe, ethical applications
* Managing real-world application flow

---

## 👤 Author

**Heet Bhatt**
BCA Student | Full Stack Development | AI Integration

Frontend UI collaboration: **Het Darji**

---

## 📄 License

This project is intended for educational and learning purposes only and should not be used as official career counselling without human review.


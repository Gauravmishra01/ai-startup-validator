# 🚀 AI Startup Validator

**Validate, Analyze & Score Your Startup Ideas with AI**

<div align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge" alt="Frontend Badge" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge" alt="Backend Badge" />
  <img src="https://img.shields.io/github/license/Gauravmishra01/ai-startup-validator?style=for-the-badge" alt="License Badge" />
</div>

---

## 🌍 **Live Links**

| Platform       | URL                                                           |
|----------------|---------------------------------------------------------------|
| 🎨 **Frontend** (Vercel) | [ai-startup-validator](https://ai-startup-validator-five.vercel.app/)           |
| ⚙️ **Backend** (Render)  | [ai-startup-validator API](https://ai-startup-validator-pol2.onrender.com/)      |
| 🧾 **GitHub Repository** | [ai-startup-validator Repo](https://github.com/Gauravmishra01/ai-startup-validator) |

---

## 🧠 **Features**

- 🌟 **AI-driven startup analysis**
- 📊 **Profitability scoring** (0–100)
- ⚠️ **Risk level prediction** (Low / Medium / High)
- 👤 **Target customer persona generator**
- 🧩 **Competitor insights** (Auto-generates 3 competitors)
- 🛠️ **Recommended tech stack**
- 📄 **Beautiful AI-generated report page**
- 💾 **Secure storage in MongoDB**
- ⚡ **Fast & responsive app built with Vite + Node.js**

---

## 🗂 **Project Structure**

```
ai-startup-validator/
│
├── client/      # React + Vite Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/      # Node.js + Express Backend
│   ├── models/
│   ├── index.js
│   ├── .env (ignored)
│   └── package.json
│
└── README.md
```

---

## 🛠 **Tech Stack**

### **Frontend**

- ⚛️ **React + Vite**
- 🎨 **TailwindCSS**
- 🔗 **Axios**
- 🧭 **React Router**

### **Backend**

- 🟩 **Node.js + Express**
- 🍃 **MongoDB + Mongoose**
- 🤖 **Any_AI LLaMA model API**

---

## 🚀 **Local Installation Guide**

### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/Gauravmishra01/ai-startup-validator
cd ai-startup-validator
```

### 🔧 **Backend Setup** (/server)

```bash
# Go to the server directory
cd server

# Install dependencies
npm install

# Create `.env` file
MONGO_URI=your_mongo_connection_string
AI_API_KEY=your_AI_api_key
PORT=5000

# Start backend
npm start

➡️ Backend runs at: http://localhost:5000
```

### 🎨 **Frontend Setup** (/client)

```bash
# Go to the client directory
cd client

# Install dependencies
npm install

# Create `.env` file
VITE_API_URL=http://localhost:5000

# Run frontend
npm run dev

➡️ Frontend runs at: http://localhost:5173
```

---

## 📡 **API Endpoints**

| Method | Endpoint       | Description                      |
|--------|----------------|----------------------------------|
| POST   | `/ideas`       | Analyze & save a startup idea    |
| GET    | `/ideas`       | Fetch all startup ideas          |
| GET    | `/ideas/:id`   | Full AI-powered report for an ID |
| DELETE | `/ideas/:id`   | Delete an idea                   |

---

## 🤖 **AI Prompt Used**

```
You are an expert startup consultant. Analyze the startup idea below and return a structured JSON object.

Input: { "title": "<title>", "description": "<description>" }

Output JSON Fields:
- problem
- customer
- market
- competitors (3 items)
- tech_stack (4–6 items)
- risk_level (Low/Medium/High)
- profitability_score (0–100)
- justification

RETURN ONLY RAW JSON.
```

---

## 🌐 **Deployment Guide**

### 🔵 **Frontend Deployment** (Vercel)

1. **Settings:**
    - Root Directory → `client`
    - Framework → `Vite`
    - Build Command → `npm run build`
    - Output Directory → `dist`

2. **Environment Variable:**
    - `VITE_API_URL=https://ai-startup-validator-pol2.onrender.com`

### 🟣 **Backend Deployment** (Render)

1. **Settings:**
    - Select **Node.js environment**
    - Connect repository → `/server`

2. **Environment Variables:**
    ```
    MONGO_URI=your_mongo_url
    GROQ_API_KEY=your_api_key
    PORT=10000
    ```

3. **Start Command:**
    ```bash
    npm start
    ```

---

## 📄 **License**

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

## 🙌 **Contributing**

Contributions are always welcome! Feel free to **open an issue** or **create a pull request**.

---

## ⭐ **Like the Project?**

If this project helped you, please consider **starring the repository** ⭐ — it motivates us to improve and add more awesome features!

---

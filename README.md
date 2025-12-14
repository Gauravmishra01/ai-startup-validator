🚀 AI Startup Validator
Validate, Analyze & Score Your Startup Ideas with AI
<p align="center"> <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge" /> <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge" /> <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge" /> <img src="https://img.shields.io/badge/AI%20Model-Groq%20LLaMA-orange?style=for-the-badge" /> </p> <p align="center"> ✨ An AI-powered tool that transforms raw startup ideas into deep insights — including problem analysis, customer personas, competitor research, market overview, technical stack, risk level, and profitability scoring. </p>
🌍 Live Links
Platform	URL
🎨 Frontend (Vercel)	https://ai-startup-validator-five.vercel.app/

⚙️ Backend (Render)	https://ai-startup-validator-pol2.onrender.com/

🧾 GitHub Repository	https://github.com/Gauravmishra01/ai-startup-validator
🧠 Features

🌟 AI-driven startup analysis
📊 Profitability scoring (0–100)
⚠️ Risk level prediction (Low / Medium / High)
👤 Target customer persona generator
🧩 Competitor insights (3 auto-generated competitors)
🛠️ Recommended tech stack
📄 Beautiful report page
💾 Ideas stored securely in MongoDB
⚡ Fast Vite UI + Node.js backend

🗂 Project Structure
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

🛠 Tech Stack
Frontend

⚛️ React + Vite

🎨 TailwindCSS

🔗 Axios

🧭 React Router

Backend

🟩 Node.js + Express

🍃 MongoDB + Mongoose

🤖 Groq LLaMA model API

🚀 Local Installation Guide
1️⃣ Clone the repository
git clone https://github.com/Gauravmishra01/ai-startup-validator
cd ai-startup-validator

🔧 Backend Setup (/server)
Install dependencies
cd server
npm install

Create .env file
MONGO_URI=your_mongo_connection_string
GROQ_API_KEY=your_groq_api_key
PORT=5000

Start backend
npm start


➡️ Backend runs at: http://localhost:5000

🎨 Frontend Setup (/client)
Install dependencies
cd client
npm install

Create .env file
VITE_API_URL=http://localhost:5000

Run frontend
npm run dev


➡️ Frontend runs at: http://localhost:5173

📡 API Endpoints
Method	Endpoint	Description
POST	/ideas	Analyze & save a startup idea
GET	/ideas	Fetch all ideas
GET	/ideas/:id	Get full AI-powered report
DELETE	/ideas/:id	Delete an idea
🤖 AI Prompt Used
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

🌐 Deployment Guide
🔵 Frontend Deployment (Vercel)

Settings:

Root Directory → client

Framework → Vite

Build Command → npm run build

Output Directory → dist

Environment Variable:

VITE_API_URL=https://ai-startup-validator-pol2.onrender.com

🟣 Backend Deployment (Render)

Select Node.js environment

Connect repository → /server

Add these environment variables:

MONGO_URI=your_mongo_url
GROQ_API_KEY=your_api_key
PORT=10000


Start Command → npm start

📄 License

This project is under the MIT License — free to use, modify, and distribute.

🙌 Contributing

Contributions are welcome!
Feel free to open an issue or create a pull request.

⭐ Like the project?

If this helped you, please star the repository ⭐ — it motivates future upgrades!



🚀 Smart Event Hub

A modern, full-stack multi-role event management platform designed for colleges, institutes, and organizations.
It allows Organizations to create and manage events and assign Event Managers who handle registrations, participants, and certificates.

Built with a stunning modern UI, session-based authentication, and scalable backend architecture.

✨ Features
🏢 Organization Panel

Organization signup & login

Create, update, and delete events

Upload event banners and details

Assign Event Managers to events

Track event-level analytics

View participant counts & certificate status

👨‍💼 Event Manager Panel

Login using assigned credentials

Manage participants

Approve/reject registrations

Bulk participants upload via CSV

Certificate generator with template customization

Email certificates to participants

Modern dashboard for quick insights

👥 Public Features

Public registration page per event

Auto-join to participant list

Optional email confirmation

🛠️ Tech Stack
Frontend

React 18

Vite

Material-UI (MUI)

TailwindCSS

React Router v6

Axios

Framer Motion (smooth animations)

Backend

Node.js + Express

MongoDB + Mongoose

Session-based Authentication

Multer for file uploads

PDFKit for certificate generation

Brevo for email services

Helmet + CORS for security

Node-cron for background jobs

📁 Folder Structure
smarteventhub/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── providers/
│   │   ├── shared/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── jobs/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── utils/
    │   └── index.js
    ├── uploads/
    └── package.json

⚙️ Getting Started
🔧 Prerequisites

Node.js (18+ recommended)

MongoDB (local or Atlas)

npm or yarn

Resend API key (for emails)

📦 Installation
1️⃣ Clone the Repository
git clone <repository-url>
cd smarteventhub

2️⃣ Install Backend Dependencies
cd server
npm install

3️⃣ Install Frontend Dependencies
cd ../client
npm install

🔐 Environment Setup
🗄️ Backend .env
PORT=5000
MONGODB_URI=<your-mongodb-uri>
SESSION_SECRET=<your-secret>
FRONTEND_URL=http://localhost:5173

BREVO_API_KEY=<your-brevo-key>

💻 Frontend .env
VITE_API_URL=http://localhost:5000/api

▶️ Running the Project
Start Backend
cd server
npm run dev

Start Frontend
cd client
npm run dev

🚀 Production Build
Build Frontend
cd client
npm run build

Start Server
cd server
npm start

🔒 Security Features

HTTP-only secure sessions

bcrypt password hashing

Helmet for HTTP security

CORS protection

Sanitized inputs

File upload validation

🧩 Key Modules
🎨 Certificate Designer

Drag & Drop layout

Custom fonts & colors

Add logos & backgrounds

Live preview

PDF export

📊 Dashboard Insights

Event statistics

Participant overview

Certificate tracking

📁 CSV Import System

Clean interface for uploading

Auto-mapped participant fields

Error handling + duplicate checking

🤝 Contributing

Fork the repository

Create your feature branch

Commit your changes

Push to the branch

Submit a pull request

🧑‍💻 Author
Vishal Patidar and Preeti Purve

🐞 Issues & Support

If you find bugs or need help, create an Issue in the repository.

❤️ Built With

Built with passion using React, Node.js, and MongoDB.
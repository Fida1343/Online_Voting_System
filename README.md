# 🗳️ Online Voting System

An **Online Voting System** developed as an academic project to understand the basics of **web application development**, **database integration**, and **client–server interaction**.

This project allows registered users to cast votes online and view election results in a simple and structured way.

---

## 📌 Project Overview

The Online Voting System is a web-based application where:
- Users can register and log in using a unique voter ID
- Logged-in users can view candidates and cast a vote
- Each user is allowed to vote only once
- Admin can view the final voting results

This project was built mainly for **learning purposes** during my undergraduate studies.

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express  
- **Database:** MySQL  
- **Security:** bcrypt (password hashing)

---

## 📂 Project Structure

Online_Voting_System/
│
├── public/
│ ├── index.html
│ ├── css/
│ │ └── style.css
│ └── js/
│ └── app.js
│
├── server.js
├── db.sql
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/Online_Voting_System.git
2️⃣ Install backend dependencies
npm install
3️⃣ Setup the database
Open MySQL

Run the commands from db.sql

Ensure the database name is voting_system

4️⃣ Configure database connection
In server.js, update credentials if required:

user: "root",
password: ""
5️⃣ Start the server
node server.js
Server will run at:

http://localhost:5000
6️⃣ Open frontend
Open public/index.html in your browser.

✨ Features
User registration with hashed passwords

Secure login authentication

One-user one-vote restriction

Candidate listing

Live vote count display

Clean and simple UI

📖 Learning Outcomes
Through this project, I learned:

How frontend communicates with backend APIs

Using Node.js with MySQL

Password hashing using bcrypt

Structuring a basic full-stack project

Handling form data and validations

⚠️ Limitations
No role-based authentication (admin is open)

No deployment (runs locally)

Not intended for real-world election usage

🔮 Future Improvements
User authentication using tokens (JWT)

Admin login system

Improved UI using a frontend framework

Deployment on cloud platforms

Vote encryption and audit logs

👨‍💻 Author
Fida Hussain
B.Tech – Computer Science & Engineering
KIIT University, Bhubaneswar

This project is intended strictly for educational purposes.

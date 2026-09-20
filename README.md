# Quiz Application - MERN Stack

A complete, modern quiz application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **User Authentication** - Register and login with JWT
- **One-Time Quiz** - Users can attempt the quiz only once
- **20-Minute Timer** - Configurable countdown timer with backend validation
- **Admin Dashboard** - Manage users, questions, and view results
- **Modern UI** - Dark theme with smooth animations
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

## Project Structure

```
quiz-app/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/           # Node.js backend
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── server.js
    └── package.json
```

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Choose one:
  - **MongoDB Atlas** (Cloud) - [Free tier](https://www.mongodb.com/cloud/atlas)
  - **MongoDB Local** - [Download](https://www.mongodb.com/try/download/community)
  - **Docker**: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

## Installation

### 1. Clone or Download the Project

```bash
# If you have git
git clone <repository-url>
cd quiz-app

# Or just navigate to the quiz-app folder
cd quiz-app
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# Use your favorite editor (VS Code, nano, etc.)
```

**Edit `backend/.env`:**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quizapp
JWT_SECRET=your_super_secret_key_here_change_this
```

**MongoDB Connection Strings:**

- **Local MongoDB**: `mongodb://localhost:27017/quizapp`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/quizapp`

### 3. Frontend Setup

```bash
# Navigate to frontend folder (from quiz-app root)
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Start Backend Server

```bash
# In the backend folder
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### Start Frontend Server

Open a **new terminal** and run:

```bash
# In the frontend folder
cd frontend
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 500 ms
➜  Local:   http://localhost:5173/
```

### Open the Application

Open your browser and go to: **http://localhost:5173**

## Creating an Admin User

After starting the backend and connecting to MongoDB, create an admin user:

### Method 1: Using MongoDB Shell (Recommended)

```bash
# Connect to MongoDB
mongosh

# Switch to quizapp database
use quizapp

# Create admin user
db.users.insertOne({
  name: "Admin",
  email: "admin@quizapp.com",
  password: "$2a$10$YourHashedPasswordHere",
  role: "admin",
  quizCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**To hash the password**, run this in a Node.js REPL:

```bash
# In backend folder
node
```

```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(hash => console.log(hash));
// Copy the output and use it in the MongoDB command above
```

### Method 2: Create a Simple Script

Create `backend/createAdmin.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@quizapp.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@quizapp.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin created successfully!');
    console.log('Email: admin@quizapp.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
```

Then run:

```bash
# In backend folder
node createAdmin.js
```

## Adding Questions

1. **Login as Admin**
   - Go to http://localhost:5173
   - Login with admin credentials
   - You'll be redirected to the admin dashboard

2. **Add Questions**
   - Click on "Questions" tab
   - Click "+ Add Question" button
   - Fill in the question form:
     - Question text
     - 4 options (A, B, C, D)
     - Select the correct answer
   - Click "Add Question"
   - Repeat for all questions

3. **Edit/Delete Questions**
   - Click "Edit" to modify a question
   - Click "Delete" to remove a question

## Testing the Application

### Test User Flow

1. **Register a New User**
   - Go to http://localhost:5173
   - Click "Register" tab
   - Fill in: Name, Email, Password
   - Click "Register"
   - You'll see a success message

2. **Login**
   - Switch to "Login" tab
   - Enter your email and password
   - Click "Login"
   - You'll be redirected to the quiz

3. **Take the Quiz**
   - Read each question carefully
   - Select an answer
   - Use "Next" and "Previous" to navigate
   - Check the question palette on the right
   - Watch the 20-minute timer
   - Click "Submit Quiz" when done
   - Confirm submission
   - You'll see the completion screen

4. **Try Again**
   - Logout and login again
   - You'll see an error: "You have already completed the quiz"

### Test Admin Flow

1. **Login as Admin**
   - Use admin credentials
   - You'll be redirected to admin dashboard

2. **View Dashboard**
   - See statistics: Total Users, Submissions, Questions, Completed

3. **Manage Users**
   - Click "Users" tab
   - Search users by name or email
   - See quiz completion status

4. **Manage Questions**
   - Click "Questions" tab
   - Add, edit, or delete questions

5. **View Results**
   - Click "Results" tab
   - See all quiz submissions
   - View scores, percentages, and time taken

## Configuration

### Change Quiz Duration

Edit `backend/config/quizConfig.js`:

```javascript
const quizConfig = {
  QUIZ_DURATION_MINUTES: 30, // Change this value (default: 20)
};

module.exports = quizConfig;
```

Restart the backend server after changing.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Quiz
- `POST /api/quiz/start` - Start quiz (protected)
- `POST /api/quiz/submit` - Submit quiz (protected)

### Questions
- `GET /api/questions` - Get all questions (protected)
- `POST /api/questions` - Create question (admin only)
- `PUT /api/questions/:id` - Update question (admin only)
- `DELETE /api/questions/:id` - Delete question (admin only)

### Admin
- `GET /api/admin/statistics` - Get dashboard stats (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/results` - Get all results (admin only)

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Make sure MongoDB is running
- **Local**: Start MongoDB service
- **Docker**: `docker start mongodb`
- **Atlas**: Check your connection string

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**: Change the port in `backend/.env`:
```env
PORT=5001
```

Also update `frontend/vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5001',
    changeOrigin: true,
  },
},
```

### CORS Error

**Solution**: Make sure the backend server is running and the proxy is configured correctly in `vite.config.js`.

### Cannot Find Module

```
Error: Cannot find module 'express'
```

**Solution**: Run `npm install` in the appropriate folder (backend or frontend).

## Features Explained

### One-Time Quiz Attempt
- Users can only take the quiz once
- Backend validates `quizCompleted` field
- Prevents multiple submissions

### Timer Validation
- Frontend shows countdown timer
- Backend validates submission time
- Prevents timer manipulation
- Auto-submits when time expires

### Security
- Passwords are hashed with bcrypt
- JWT tokens for authentication
- Protected routes require valid tokens
- Admin routes require admin role
- Correct answers never sent to users during quiz

### Responsive Design
- Works on all screen sizes
- Mobile-friendly question palette
- Touch-friendly buttons
- Optimized layouts

## Development Tips

### Backend Development

```bash
# Run with nodemon (auto-restart)
npm run dev

# Run without nodemon
npm start
```

### Frontend Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### View MongoDB Data

Use MongoDB Compass or mongosh:

```bash
# Connect to MongoDB
mongosh

# Use database
use quizapp

# View collections
show collections

# View users
db.users.find()

# View questions
db.questions.find()

# View quiz attempts
db.quizattempts.find()
```

## License

This is a student project. Feel free to use and modify as needed.

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Make sure all dependencies are installed
3. Verify MongoDB is running
4. Check the console for error messages
5. Review the API endpoints and responses

---

**Happy Quizzing! 🎉**

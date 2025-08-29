# team-task-manager
Description :
Build a lightweight task management application where teams can create projects, add tasks, assign members, and update task statuses. The goal is to evaluate your ability to work across the full stack: frontend (React/Next + Redux/Context), backend (Node.js + Express), database (MongoDB), and deployment.

This repository contains a full-stack task management app (React + Node + MongoDB).
# Installation
Clone the repository: 
git clone <repository-url>
cd <project-folder>

# Install dependencies:
npm install
# or
yarn install

## Environment Variables Setup

1. Create a `.env` file in the root of your project.

2. Add the following environment variables in the `.env` file with your own values:
   
PORT=8000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=1h

EMAIL_USERNAME=your_email@example.com

EMAIL_PASSWORD=your_email_password

FRONTEND_URL=http://localhost:5173

#############################################################


# Running the app locally
Backend : npm run server
Frontend : npm run dev
# or
yarn dev

#Open your browser at http://localhost:5173 to view the app.

////////////////////////////// Assumptions and decisions ///////////////////////////////
Only project owners can add or remove members.

Project membership controls project visibility and task access.

Activities are logged per task for tracking changes.

User authentication is required to access protected routes (using JWT). + verification of mail(nodemailer)

MongoDB is used as the primary database.

Task statuses include Pending, In Progress, Completed, and Delayed.

Project with filters by timerange , start date , end date, search 

Frontend uses React with Material-UI and Redux for state management.

API follows REST conventions.

Error handling and loading states are displayed in the UI for better UX.


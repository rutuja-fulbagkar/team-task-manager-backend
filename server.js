import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from "./config/db.js";
import authRoute from './routes/authRoutes.js'
import taskRoute from "./routes/taskRoutes.js";
import projectRoute from "./routes/projectRoutes.js";
import userRoute from "./routes/userRoutes.js";

dotenv.config();
connectDB();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
app.use(cors({
  origin: 'http://localhost:5173',  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoute);
app.use("/api/projects", projectRoute);
app.use("/api/users", userRoute);
app.use("/api/tasks", taskRoute); 

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => { 
    res.send('Hello, World!');
});
const httpServer = createServer(app);
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
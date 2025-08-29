import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware/auth.js";
import { getAllUsers } from "../controllers/authController/userController.js";

const router = express.Router();

router.get("/", requireSignIn, getAllUsers);  

export default router;

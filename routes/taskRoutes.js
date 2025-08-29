import express from "express";
import { createTask, deleteTask, getTasksByProject, updateTask,getTaskActivities } from "../controllers/taskController/taskController.js";
import { requireSignIn } from "../middlewares/authMiddleware/auth.js";

const router = express.Router();

router.post("/projects/:projectId/tasks", requireSignIn, createTask);
router.get("/projects/:projectId/tasks", requireSignIn, getTasksByProject);
router.put("/:id", requireSignIn, updateTask);
router.delete("/:id", requireSignIn, deleteTask);
router.get("/:taskId/activities", requireSignIn, getTaskActivities);

export default router;

import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware/auth.js";
import {
  createProject, getProjects, getProjectById,
  updateProject, deleteProject, addMember,getAllProjectsWithoutPagination
} from "../controllers/projectController/projectController.js";

const router = express.Router();

router.post("/", requireSignIn, createProject);
router.get("/", requireSignIn, getProjects);
router.get("/all", getAllProjectsWithoutPagination);
router.get("/:id", requireSignIn, getProjectById);
router.put("/:id", requireSignIn, updateProject);
router.delete("/:id", requireSignIn, deleteProject);
router.post("/:id/members", requireSignIn, addMember);

export default router;

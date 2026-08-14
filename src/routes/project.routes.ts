import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  updateProject,
} from "../controllers/project.controller";
import { authenticate } from "../middlewares/auth.middleware";

const projectRoutes = Router();

projectRoutes.use(authenticate);

projectRoutes.post("/", createProject);
projectRoutes.get("/", listProjects);
projectRoutes.get("/:id", getProjectById);
projectRoutes.put("/:id", updateProject);
projectRoutes.delete("/:id", deleteProject);

export { projectRoutes };
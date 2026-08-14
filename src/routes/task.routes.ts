import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasksByProject,
  markTaskAsDone,
  updateTask,
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";

const taskRoutes = Router();

taskRoutes.use(authenticate);

taskRoutes.post("/projects/:projectId/tasks", createTask);
taskRoutes.get("/projects/:projectId/tasks", listTasksByProject);

taskRoutes.get("/tasks/:id", getTaskById);
taskRoutes.put("/tasks/:id", updateTask);
taskRoutes.delete("/tasks/:id", deleteTask);
taskRoutes.patch("/tasks/:id/done", markTaskAsDone);

export { taskRoutes };
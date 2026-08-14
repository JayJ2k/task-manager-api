import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.routes";
import { projectRoutes } from "./routes/project.routes";
import { taskRoutes } from "./routes/task.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    message: "Task Manager API is running",
  });
});

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use(taskRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
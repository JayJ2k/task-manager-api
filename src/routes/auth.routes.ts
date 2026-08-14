import { Router } from "express";
import { getMe, login, register } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", authenticate, getMe);

export { authRoutes };
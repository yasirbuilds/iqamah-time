import { Router } from "express";
import { register, login } from "../controllers/authController";
import { validateRegister, validateLogin } from "../middlewares/validation";

const router = Router();

// POST /auth/register
router.post("/register", validateRegister, register);

// POST /auth/login
router.post("/login", validateLogin, login);

export default router;

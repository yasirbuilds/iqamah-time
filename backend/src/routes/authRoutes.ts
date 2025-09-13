import { Router } from "express";
import { register, login, googleSignIn } from "../controllers/authController";
import { validateRegister, validateLogin, validateGoogleSignIn } from "../middlewares/validation";

const router = Router();

// POST /auth/register
router.post("/register", validateRegister, register);

// POST /auth/login
router.post("/login", validateLogin, login);

// POST /auth/google
router.post("/google", validateGoogleSignIn, googleSignIn);

export default router;

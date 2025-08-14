import express from "express";
import AuthController from "../controllers/auth";

const router = express.Router();

// Auth Routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

export default router;
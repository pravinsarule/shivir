import express from "express";
import { loginUser, registerUser, setupPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/setup-password", setupPassword);

export default router;

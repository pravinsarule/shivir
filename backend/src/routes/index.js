import express from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "./authRoutes.js";
import peopleRoutes from "./peopleRoutes.js";
import paramMitraRoutes from "./paramMitraRoutes.js";

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/people", peopleRoutes);
router.use("/param-mitra", paramMitraRoutes);

export default router;

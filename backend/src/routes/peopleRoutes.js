import express from "express";
import { getPeople, createPerson } from "../controllers/peopleController.js";

const router = express.Router();

router.get("/", getPeople);
router.post("/", createPerson);

export default router;

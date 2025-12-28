import express from "express";
import { generateDailyDigest, getTodayDigest, regenerateDailyDigest } from "../controllers/digestController.js";

const digestRouter = express.Router();

// Generate today's digest for a user
digestRouter.post("/generate/:userId", generateDailyDigest);
digestRouter.get("/today/:userId", getTodayDigest);
digestRouter.post("/regenerate/:userId", regenerateDailyDigest);

export default digestRouter;

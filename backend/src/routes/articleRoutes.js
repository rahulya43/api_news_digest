import express from "express";
import callFetcher from "../controllers/articleController.js"

const articleRouter = express.Router();

articleRouter.post('/fetch',callFetcher);

export default articleRouter;

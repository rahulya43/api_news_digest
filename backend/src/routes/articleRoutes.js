import express from "express";
import callFetcher from "../controllers/articleController.js"
import { summarizeArticles, resetSummaries, clearAllArticles } from "../controllers/summarizeController.js"

const articleRouter = express.Router();

articleRouter.post('/fetch',callFetcher);
articleRouter.post('/summarize',summarizeArticles);
articleRouter.post('/reset-summaries', resetSummaries);
articleRouter.post('/clear-articles', clearAllArticles);

export default articleRouter;

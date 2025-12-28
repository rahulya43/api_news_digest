import Article from "../models/articleModel.js";
import summarizeArticle from "../services/articleSummarizer.js";

/**
 * Batch summarize articles that are not yet summarized
 */
const summarizeArticles = async (req, res) => {
  try {
    // 1. Find articles without AI summary
    const articles = await Article.find({
      $or: [
        { aiSummary: { $exists: false } },
        { aiSummary: "" }
      ]
    });

    const pendingCount = articles.length;

    // 2. Guard condition
    if (articles.length === 0) {
      return res.json({
        success: true,
        message: "No articles pending summarization",
        pending: 0,
        summarized: 0
      });
    }

    let summarizedCount = 0;

    // 3. Sequentially summarize articles
    for (const article of articles) {
      const { title, content } = article;

      const aiResult = await summarizeArticle({ title, content });

      // 4. Persist AI data
      article.aiSummary = aiResult.summary;
      article.aiBullets = aiResult.bullets;
      article.summaryModel = aiResult.model;
      article.summarizedAt = new Date();

      await article.save();
      summarizedCount++;
    }

    // 5. Final response
    res.json({
      success: true,
      message: "Articles summarized successfully",
      pending: pendingCount,
      summarized: summarizedCount
    });

  } catch (error) {
    console.error("Batch summarization failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to summarize articles"
    });
  }
};

/**
 * Reset all article summaries (for testing)
 */
const resetSummaries = async (req, res) => {
  try {
    const result = await Article.updateMany(
      { aiSummary: { $exists: true } },
      { $unset: { aiSummary: "", aiBullets: "", summaryModel: "", summarizedAt: "" } }
    );

    res.json({
      success: true,
      message: `Reset summaries for ${result.modifiedCount} articles`,
      resetCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Reset summaries failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset summaries"
    });
  }
};

/**
 * Clear all articles (for testing fresh fetches)
 */
const clearAllArticles = async (req, res) => {
  try {
    const result = await Article.deleteMany({});
    res.json({
      success: true,
      message: `Cleared ${result.deletedCount} articles from database`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Clear articles failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear articles"
    });
  }
};

export { resetSummaries, summarizeArticles, clearAllArticles };

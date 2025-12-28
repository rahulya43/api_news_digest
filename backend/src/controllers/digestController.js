import Digest from "../models/digestModel.js";
import Article from "../models/articleModel.js";
import userModel from "../models/userModel.js";

/**
 * Generate daily digest for a user
 */
const generateDailyDigest = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Fetch user preferences
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const { interests = [], keywords = [] } = user;

    // Normalize today's date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Check if digest already exists for today
    const existingDigest = await Digest.findOne({
      userId,
      date: today
    });

    if (existingDigest) {
      return res.json({
        success: true,
        message: "Digest already generated for today",
        digest: existingDigest
      });
    }

    // 3. Fetch summarized articles from last 24 hours
    const since = new Date();
    since.setDate(since.getDate() - 1);

    const articles = await Article.find({
      aiSummary: { $exists: true, $ne: "" }
    }).sort({ publishedAt: -1 }).limit(20);

    console.log(`Found ${articles.length} summarized articles`);
    console.log('User interests:', interests);
    console.log('User keywords:', keywords);
    
    // 4. Filter articles by interests / keywords (more flexible)
    const filtered = articles.filter(article => {
      const text =
        `${article.title} ${article.content} ${article.tags?.join(" ")}`.toLowerCase();

      // If no interests/keywords, return top articles
      if (interests.length === 0 && keywords.length === 0) {
        return true;
      }

      // Very flexible matching - include articles with partial matches
      const hasInterest = interests.length === 0 || interests.some(i => {
        const interest = i.toLowerCase();
        const isMatch = text.includes(interest) || 
                        text.includes(interest.slice(0, -1)) || // Remove last character for partial match
                        text.includes(interest.slice(0, 4)); // First 4 characters
        if (isMatch) console.log(`Interest match for '${interest}' in article: ${article.title}`);
        return isMatch;
      });
      
      const hasKeyword = keywords.length === 0 || keywords.some(k => {
        const keyword = k.toLowerCase();
        const isMatch = text.includes(keyword) || 
                        text.includes(keyword.slice(0, -1)) ||
                        text.includes(keyword.slice(0, 3));
        if (isMatch) console.log(`Keyword match for '${keyword}' in article: ${article.title}`);
        return isMatch;
      });
      
      return hasInterest || hasKeyword;
    });

    console.log(`Filtered to ${filtered.length} articles`);

    // 5. If still too few articles, include top recent articles
    let selected = filtered;
    if (selected.length < 10) {
      const additional = articles
        .filter(article => !filtered.includes(article))
        .slice(0, 10 - selected.length);
      selected = [...selected, ...additional];
      console.log(`Added ${additional.length} additional articles to reach minimum`);
    }

    // 6. Limit digest size (increased from 6 to 15)
    selected = selected.slice(0, 15);

    if (selected.length === 0) {
      return res.json({
        success: true,
        message: "No relevant articles for today",
        digest: null
      });
    }

    // 7. Build digest items (snapshot)
    const items = selected.map(article => ({
      articleId: article._id,
      title: article.title,
      summary: article.aiSummary,
      bullets: article.aiBullets,
      url: article.url
    }));

    // 8. Save digest
    const digest = await Digest.create({
      userId,
      date: today,
      items
    });

    res.json({
      success: true,
      message: "Daily digest generated successfully",
      count: items.length,
      digest
    });

  } catch (error) {
    console.error("Digest generation failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate daily digest"
    });
  }
};

/**
 * Get today's digest for a user
 */
const getTodayDigest = async (req, res) => {
  try {
    const { userId } = req.params;

    // Normalize today's date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const digest = await Digest.findOne({
      userId,
      date: today
    });

    if (!digest) {
      return res.status(404).json({
        success: false,
        message: "No digest found for today"
      });
    }

    res.json({
      success: true,
      digest
    });

  } catch (error) {
    console.error("Fetching today's digest failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's digest"
    });
  }
};


/**
 * Regenerate today's digest (overwrite existing)
 */
const regenerateDailyDigest = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Delete existing digest for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await Digest.deleteOne({ userId, date: today });

    // 2. Generate new digest
    req.params.userId = userId; // Ensure userId is set
    return generateDailyDigest(req, res);
  } catch (error) {
    console.error("Digest regeneration failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to regenerate daily digest"
    });
  }
};

export { generateDailyDigest, getTodayDigest, regenerateDailyDigest };

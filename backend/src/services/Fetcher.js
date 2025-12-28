import Article from "../models/articleModel.js";
import User from "../models/userModel.js";
import axios from "axios";

const NEWS_API_KEY = "";

const fetchArticle = async(userId = null)=>{
    try {
        console.log("Starting to fetch articles...");
        
        // If userId provided, fetch based on user interests
        let queryParams = {
            country: "us",
            pageSize: 20,
            apiKey: NEWS_API_KEY
        };

        if (userId) {
            const user = await User.findById(userId);
            if (user && user.interests.length > 0) {
                // Use user interests to fetch relevant articles
                const interest = user.interests[0]; // Use first interest for simplicity
                delete queryParams.country;
                queryParams.q = interest;
                queryParams.language = 'en';
                queryParams.sortBy = 'publishedAt';
                console.log(`Fetching articles for interest: ${interest}`);
            }
        }
        
        const response = await axios.get("https://newsapi.org/v2/everything", {
            params: queryParams,
            timeout: 30000
        });
        
        const articles = response.data.articles;
        console.log(`Fetched ${articles.length} articles from News API`);

        let savedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for(const items of articles)
        {
            if(!items.url) {
                skippedCount++;
                continue;
            }
            
            try {
                const exists = await Article.findOne({url:items.url}).maxTimeMS(5000);
                if(exists) {
                    skippedCount++;
                    continue;
                }

                const newArticle  = new Article({
                    title:items.title,
                    url:items.url,
                    source:items.source?.name,
                    publishedAt:items.publishedAt,
                    content:items.content
                });
                await newArticle.save();
                savedCount++;
            } catch (saveError) {
                errorCount++;
                console.error(`Error saving article: ${items.title}`, saveError.message);
                continue;
            }
        }
        console.log(`Successfully saved ${savedCount} new articles`);

        return {
            fetchedCount: articles.length,
            savedCount,
            skippedCount,
            errorCount
        };
    } catch (error) {
        console.error("Error fetching articles:", error.message);
        throw error;
    }
}
export default fetchArticle;

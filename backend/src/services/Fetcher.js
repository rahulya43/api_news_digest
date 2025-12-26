import Article from "../models/articleModel.js";
import axios from "axios";

const NEWS_API_KEY = "866957b4c5af4bf2aebb7d462168f5ca";

const fetchArticle = async()=>{
    try {

        const response = await axios.get("https://newsapi.org/v2/top-headlines",
            {
                params:{
                    category:"technology",
                    pageSize:20,
                    apiKey:NEWS_API_KEY
                }
            }
        );
        
        const articles = response.data.articles;

        for(const items of articles)
        {
            if(!items.url) continue;
            const exists = await Article.findOne({url:items.url});
            if(!exists)
            {
                const newArticle  = new Article({
                    title:items.title,
                    url:items.url,
                    source:items.source?.name,
                    publishedAt:items.publishedAt,
                    content:items.content
                });
                await newArticle.save();
            }
        }
        console.log("Articles fetched successfully");
    } catch (error) {
        console.error("Error fetching articles:", error.message);
        throw error;
    }
}
export default fetchArticle;
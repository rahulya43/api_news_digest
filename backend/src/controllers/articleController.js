import fetchArticle from "../services/Fetcher.js"


const callFetcher = async(req,res)=>{
    try {
        const { userId } = req.body;
        const stats = await fetchArticle(userId);

        res.status(200).json({
            success:true,
            message:"Fetched Successfully",
            ...stats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Failed to fetch articles"
        })
        
    }
}

export default callFetcher;

import fetchArticle from "../services/Fetcher.js"


const callFetcher = async(req,res)=>{
    try {
        await fetchArticle();

        res.status(200).json({
            success:true,
            message:"Fetched Successfully"
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

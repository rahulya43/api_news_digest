import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true,
      unique: true
    },
    source: {
      type: String
    },
    publishedAt: {
      type: Date
    },
    content: {
      type: String
    },
    tags: {
      type: [String]
    },
    aiSummary:{
        type:String
    },
    aiBullets:{
        type:[String]
    },
    summarizedAt:{
        type:Date
    },
    summaryModel:{
        type:String
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt
  }
);

const Article =
  mongoose.models.Article || mongoose.model("Article", articleSchema);

export default Article;

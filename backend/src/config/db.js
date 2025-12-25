import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://rahul:891984@cluster0.5pepti0.mongodb.net/ai_news_digest";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;

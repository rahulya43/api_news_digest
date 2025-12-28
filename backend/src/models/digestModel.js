import mongoose from "mongoose";

const digestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    date: {
      type: Date,
      required: true,
      default: () => new Date().setHours(0, 0, 0, 0)
    },

    items: [
      {
        articleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Article"
        },
        title: String,
        summary: String,
        bullets: [String],
        url: String
      }
    ],

    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Digest =
  mongoose.models.Digest || mongoose.model("Digest", digestSchema);

export default Digest;

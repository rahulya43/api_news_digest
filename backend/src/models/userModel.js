import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    interests: {
      type: [String],
      required: true
    },
    keywords: {
      type: [String],
      required: true
    },
    delivery: {
      type: String,
      enum: ["email", "inapp"],
      default: "email"
    },
    digestTime: {
      type: String,
      default: "08:00"
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

const blacklistToken =
  mongoose.models.blacklistToken ||
  mongoose.model("blacklistToke", blacklistSchema);

export default blacklistToken;

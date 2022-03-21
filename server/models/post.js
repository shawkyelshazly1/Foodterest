import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  content: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  authorId: { type: mongoose.SchemaTypes.ObjectId, required: true },
});

module.exports = mongoose.model("Post", postSchema);

import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    image: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    authorId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;

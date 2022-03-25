import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    image: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    authorId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;

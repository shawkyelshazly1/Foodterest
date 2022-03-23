import mongoose from "mongoose";

const postLikeSchema = mongoose.Schema(
  {
    postId: { type: mongoose.SchemaTypes.ObjectId, reuired: true },
    authorId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  },
  { timestamps: true }
);

const PostLike = mongoose.model("PostLike", postLikeSchema);

export default PostLike;

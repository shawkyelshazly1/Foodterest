import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    postId: { type: mongoose.SchemaTypes.ObjectId, reuired: true },
    authorId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  },
  { timeStamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

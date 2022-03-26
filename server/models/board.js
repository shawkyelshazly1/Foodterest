import mongoose from "mongoose";

const boardSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    privacy: { type: String, required: true, default: "public" },
    posts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Post" }],
    postsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);



export default Board;

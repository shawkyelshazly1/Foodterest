import mongoose from "mongoose";

const followerSchema = mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    target: { type: mongoose.SchemaTypes.ObjectId, ref: "User" }, // current user is the target
  },
  { timestamps: true }
);

const Follower = mongoose.model("Follower", followerSchema);

export default Follower;

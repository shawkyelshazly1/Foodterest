import mongoose from "mongoose";

const followingSchema = mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" }, // current user is the follower
    target: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Following = mongoose.model("Following", followingSchema);

export default Following;

import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  //FIXME: Add default avatar
  avatar: { type: String, required: true, trim: true, default: "s" },
  tokenVersion: { type: Number, required: true, default: 0 },
});

//TODO: Create function on delete to delete all user interactions from other models

const User = mongoose.model("User", userSchema);

export default User;

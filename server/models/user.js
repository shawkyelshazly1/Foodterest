import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    avatar: {
      type: String,
      required: true,
      trim: true,
      default:
        "https://res.cloudinary.com/dwufx31ox/image/upload/v1647885847/Foodterest/h4ibhkznjlpfp1jbpnya.png",
    },
    tokenVersion: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

//TODO: Create function on delete to delete all user interactions from other models

const User = mongoose.model("User", userSchema);

export default User;

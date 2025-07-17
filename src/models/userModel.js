import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: [true, "A username is required!"],
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profileImg: {
    type: String,
    default:
      "https://res.cloudinary.com/dguqpdnw6/image/upload/v1750306565/codeconnect/vpprdbsn4uxjfygao27v.png",
    required: [true, "Provide image"],
  },
  applied: [
    {type: Schema.Types.ObjectId, ref: "Job"}
  ],
  resume: {
    type: String,
    default: ""
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
import mongoose from "mongoose";
import ExperienceModel from "./ExperienceModel";

const { Schema, model } = mongoose;
const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: "A name is required",
    },
    surname: {
      type: String,
      required: "A surname is required",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    bio: {
      type: String,
      required: "Come on! everyone wants to know a little more about you!",
      minLength: 10,
      maxLength: 500,
    },
    title: {
      type: String,
      required: "A title is required",
    },
    area: {
      type: String,
      required: "An area is required",
    },
    gender: {
      type: String,
      required: "Gender is required",
    },
    image: {
      type: String,
      default: function () {
        if (this.gender === "male") {
          return "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png";
        } else if (this.gender === "N/D") {
          return "http://simpleicon.com/wp-content/uploads/user1.svg";
        } else if (this.gender === "female") {
          return "https://cdn.icon-icons.com/icons2/1736/PNG/512/4043251-avatar-female-girl-woman_113291.png";
        }
      },
    },
    username: {
      type: String,
      required: "A username is required",
      maxLength: 15,
    },
    experiences: [ExperienceModel],
  },
  { timestamps: true }
);

export default model("user", UserSchema);

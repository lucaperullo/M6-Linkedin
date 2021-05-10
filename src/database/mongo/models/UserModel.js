import mongoose from "mongoose";
import ExperienceModel from "./ExperienceModel";


const {Schema, model} = mongoose

const UserSchema = new Schema({

  name: String,
  experiences: [ExperienceModel]

})

export default model('user', UserSchema)
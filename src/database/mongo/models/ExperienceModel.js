import mongoose from "mongoose";

const { Schema, model } = mongoose

const ExperienceSchema = new Schema({
    role: {
        type: String,
        required,
        minLength: [3, 'Minimum length should be 5 characters'],
        maxLength: [20, 'Maximum length should be 20 characters']
    },
    company: {
        name: String,
        required
    },
    startDate: {
        type: Date,
        required
    },
    endDate: {
        type: Date,
        required
    },
    description: {
        type: String,
        required,
        minlength: [5, 'Minimum length should be 5 characters'],
    },
    area: {
        type: String,
        required,
    },
    username: {
        type: String,
        required,
    },
    image: {
        type: String,
        default: "https://www.mindmeister.com/blog/wp-content/uploads/2019/03/Document-Writing.png",
    },
},
    { timestamps: true },
);

export default model("Experience", ExperienceSchema)
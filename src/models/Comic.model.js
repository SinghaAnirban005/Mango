import mongoose from "mongoose";
import { Schema } from "mongoose";

const comicSchema = new Schema({
    bookName: {
        type: String,
        required: true
    },

    authorName: {
        type: String,
        required: true
    },

    yearOfPublication:{
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        default: 0
    },
    
    numberOfPages:  {
        type: Number,
        required: true
    },

    condition:{
        type: String,
        enum: ['new', 'used'],
        required: true
    },

    description: {
        type: String
    }

}, {
    timestamps: true
})

export const Comic = mongoose.model("Comic", comicSchema)
// models/link.model.js
import mongoose, { Schema } from "mongoose";

const linkSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Link = mongoose.model('Link', linkSchema);

export default Link;
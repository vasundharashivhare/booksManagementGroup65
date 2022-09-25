const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema({      
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    excerpt: {
        type: String,     
        required: true,
        trim: true
    },
    userId: {
        type: ObjectId,
        ref: "bookManagementPrtoject_user",
        required: true,
        trim: true
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: [String],
        required: true,
    },
    reviews: {
        type: Number,
        default: 0,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
        deletedAt: { type: Date,default:null },

    releasedAt: { type: Date, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Books', bookSchema);   // crete model = variable name + collection name

// what is CORS policy: 

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        required: true,
        ref: 'bookManagementProject_book'
    },
    reviewedBy: {
        type: String,
        default: 'Guest'
    },
    reviewedAt: {
        type: Date,
    },
    rating: {
        type: Number,
        minimum: 1,
        maximum: 5,
        required: true,
    },
    review: { type: String },
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model('Reviews', reviewSchema);
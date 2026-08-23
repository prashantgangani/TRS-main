const mongoose = require('mongoose');

const previousMeetSchema = new mongoose.Schema({
    themeName: { type: String, required: true },

    date: { type: String },
    time: { type: String },
    location: { type: String },

    meetType: { type: String },
    dressCode: { type: String },

    car: { type: String },

    cmlLead: { type: String },
    host: { type: String },

    description: { type: String },
    rules: { type: String },

    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1000'
    },

    imageUrls: {
        type: [String],
        default: []
    },

    order: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

previousMeetSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model('PreviousMeet', previousMeetSchema);
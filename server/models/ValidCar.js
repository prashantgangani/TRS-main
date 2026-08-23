const mongoose = require('mongoose');

const validCarSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ''
    },

    vehicles: {
        type: String,
        default: ''
    },

    imageUrl: {
        type: String,
        default: ''
    },

    isValid: {
        type: Boolean,
        default: true
    },

    order: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    'ValidCar',
    validCarSchema
);
const mongoose = require('mongoose');

var formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'This field is required.',
        unique: true
    },
    duration: {
        type: Number,
        required: 'This field is required.',
    },
    dept: {
        type: String
    },
    question: {
        type: Number,
        required: 'This field is required.'
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "completed"]
    },
    marks: {
        type: Number,
        required: 'This field is required.'
    }
});

module.exports = test = mongoose.model('Testdetail',formSchema);
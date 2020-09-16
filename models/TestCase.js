const mongoose = require('mongoose');

var testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.',
        unique: true
    },
    questionid: {
        type: String,
        required: 'This field is required'
    },
    input: {
        type: String,
    },
    expected: {
        type: String,
        required: 'This field is required.'
    },
    score: {
        type: Number,
        required: 'This field is required.'
    }
});

module.exports = testcase = mongoose.model('Testcase', testSchema);
const mongoose = require('mongoose');

var resultSchema = new mongoose.Schema({
    user: {
        type: String,
        required: 'This field is required.'
    },
    test: {
        type: String,
        required: 'This field is required.'
    },
    attempted: {
        type: Boolean,
        default: false
    }
});

module.exports = result = mongoose.model('TestResult', resultSchema)
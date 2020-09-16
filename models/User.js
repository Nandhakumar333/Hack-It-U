const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.',
        unique: true
    },
    rollno: {
        type: String,
        required: 'This field is required.',
        unique: true
    },
    role: {
        type: String,
        required: 'This field is required.',
        default: "student",
        enum: ["student", "faculty", "admin"]
    },
    dept: {
        type: String
    },
    phone: {
        type: Number,
        unique: true
    },
    email: {
        type: String,
        required: 'This field is required.',
        unique: true
    },
    password: {
        type: String,
        required: 'This field is required.'
    }
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

module.exports = User = mongoose.model('Users', userSchema);
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, 'A name must be entered'],
        trim: true,
        maxLength: 45
    },
    text: {
        type: String,
        required: [true, 'Some message must be provided'],
        trim: true,
        maxLength: 510
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);
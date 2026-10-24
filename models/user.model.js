const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshTokenHash: {
        type: String,
        default: null,
    },
    previousRefreshTokenHash: {
        type: String,
        default: null,
    },
    refreshRotatedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User; 
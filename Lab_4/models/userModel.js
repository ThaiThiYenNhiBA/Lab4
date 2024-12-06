const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    failedAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);

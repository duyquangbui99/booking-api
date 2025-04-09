const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // usernames must be unique
    },
    pin: {
        type: String,
        required: true, // hashed pin
    },
    role: {
        type: String,
        enum: ['admin', 'worker'],
        default: 'worker',
        required: true,
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        default: null, // only for role === 'worker'
    }
});

module.exports = mongoose.model('User', userSchema);

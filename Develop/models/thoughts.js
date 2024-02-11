const mongoose = require('mongoose');

const thoughtsSchema = new mongoose.Schema({
    thoughtText: {
        type: String,
        required: 'You need to leave a thought!',
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    reactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reactions',
        },
    ],
});

const Thoughts = mongoose.model('Thoughts', thoughtsSchema);

module.exports = Thoughts;
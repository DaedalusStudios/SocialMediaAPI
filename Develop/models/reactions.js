const mongoose = require('mongoose');

//reactions must be linked to a thought
const reactionsSchema = new mongoose.Schema({
    reactionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    thoughtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thoughts',
        required: true
    }
});

const Reactions = mongoose.model('Reactions', reactionsSchema);

module.exports = Reactions
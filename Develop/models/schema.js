const mongoose = require('mongoose');

// Define thoughtsSchema
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
        ref: 'Users', // Reference the Users model
        required: true,
    },
    reactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reactions',
        },
    ],
});

// Define pre middleware to delete reactions associated with the thought
thoughtsSchema.pre('findOneAndDelete', {document:false,query:true}, async function (next) {
    const thought = this.getQuery()["_id"];
    try {
      // Delete all reactions associated with the thought
      await Reactions.deleteMany({ thoughtId: thought });
      next();
    } catch (error) {
      next(error);
    }
});

// Define reactionsSchema
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
        ref: 'Thoughts', // Reference the Thoughts model
        required: true
    }
});

// Define usersSchema
const usersSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trimmed: true },
    email: { type: String, required: true, unique: true, trimmed: true },
    thoughts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thoughts', // Reference the Thoughts model
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
});

// Define pre middleware to delete thoughts associated with the user
usersSchema.pre('findOneAndDelete', {document:false,query:true}, async function (next) {
    const user = this.getQuery()["_id"];
    try {
      // Delete all thoughts associated with the user
      await Thoughts.deleteMany({ userId: user });
      next();
    } catch (error) {
      next(error);
    } 
});

// Define models
const Users = mongoose.model('Users', usersSchema);
const Thoughts = mongoose.model('Thoughts', thoughtsSchema);
const Reactions = mongoose.model('Reactions', reactionsSchema);

module.exports = { Users, Thoughts, Reactions };

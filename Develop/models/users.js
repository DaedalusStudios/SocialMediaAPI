const mongoose = require('mongoose');


const usersSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trimmed: true },
  email: { type: String, required: true, unique: true, trimmed: true },
  thoughts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thoughts', 
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
});

usersSchema.pre('findOneAndDelete', { document: true }, async function (next) {
  const user = this;
  try {
    // Delete all thoughts associated with the user
    await Thoughts.deleteMany({ userId: user._id });
    next();
  } catch (error) {
    next(error);
  } 
});

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;

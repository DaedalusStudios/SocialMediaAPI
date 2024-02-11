const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  thoughts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thoughts', 
    },
  ],
});

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;

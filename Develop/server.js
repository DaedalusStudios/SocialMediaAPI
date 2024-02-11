const express = require('express');
const db = require('./config/connection');
// Require model
const { Users, Thoughts, Reactions } = require('./models');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api', (req, res) => {
  res.sendFile(path.join(__dirname, './info.txt'));
});

// Creates a new user
app.post('/api/user/', (req, res) => {
  Users.create(req.body)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });

});

// Retrieves a user by its _id and populated thought and reaction data
app.get('/api/user/:id', (req, res) => {
  Users.findOne({ _id: req.params.id })
  .populate({
    path: 'thoughts',
    populate: {
      path: 'reactions',
      model: 'Reactions'
    }
  })
    .select('-__v')
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Updates a user by its _id
app.put('/api/user/:id', (req, res) => {
  Users.findOneAndUpdate({ _id: req.params.id },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

//Deletes a user by its _id
app.delete('/api/user/:id', (req, res) => {
  Users.findOneAndDelete({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Creates a new thought, then update it to make sure it refernces the user.
app.post('/api/thought/', (req, res) => {
  Thoughts.create(req.body)
    .then((thought) => {
      // Update the corresponding user document to include the new thought
      Users.findOneAndUpdate(
        { _id: thought.userId }, // Find the user by the userId associated with the thought
        { $push: { thoughts: thought._id } }, // Push the new thought's ID into the user's thoughts array
        { new: true } // Return the updated user document
      )
        .then((user) => {
          // Check if the user exists
          if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(thought); // Return the created thought
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
});

// reads a thought by id
app.get('/api/thought/:id', (req, res) => {
  Thoughts.findOne({ _id: req.params.id })
    .then((thought) => {
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(thought);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Updates a thought by its _id
app.put('/api/thought/:id', (req, res) => {
  Thoughts.findOneAndUpdate({ _id: req.params.id },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((thought) => {
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(thought);
    })
    .catch((err) => {
      res.json(err);
    }
    );
});

// Deletes a thought by its _id
app.delete('/api/thought/:id', (req, res) => {
  Thoughts.findOneAndDelete({ _id: req.params.id })
    .then((thought) => {
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(thought);
    })
    .catch((err) => {
      res.json(err);
    });
});


// Creates a new reaction and updates the corresponding thought document to include the new reaction
app.post('/api/thought/:thoughtId/reaction/', (req, res) => {
  const thoughtId = req.params.thoughtId;
  req.body.thoughtId = thoughtId;
  Reactions.create(req.body)
    .then((reaction) => {
      Thoughts.findOneAndUpdate(
        { _id: thoughtId }, 
        { $push: { reactions: reaction._id } }, 
        { new: true } 
      )
        .then((thought) => {
          // Check if the thought exists
          if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
          }
          res.json(reaction); // Return the created reaction
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
});

// Deletes a reaction by its _id
app.delete('/api/reaction/:id', (req, res) => {
  Reactions.findOneAndDelete({ _id: req.params.id })
    .then((reaction) => {
      if (!reaction) {
        res.status(404).json({ message: 'No reaction found with this id!' });
        return;
      }
      res.json(reaction);
    })
    .catch((err) => {
      res.json(err);
    });
  });

// Retrieves all users
app.get('/api/users/', (req, res) => {
  Users.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Retrieves all thoughts
app.get('/api/thoughts/', (req, res) => {
  Thoughts.find({})
    .then((thoughts) => {
      res.json(thoughts);
    })
    .catch((err) => {
      res.json(err);
    });
});


// Add friends to a user's friend list
app.post('/api/user/:userId/friends/:friendId', (req, res) => {
  Users.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendId } },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Deletes a friend from a user's friend list
app.delete('/api/user/:userId/friends/:friendId', (req, res) => {
  Users.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

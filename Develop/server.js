const express = require('express');
const db = require('./config/connection');
// Require model
const { Users, Thoughts, Reactions } = require('./models');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './info.txt'));
});

// Creates a new user
app.post('/user/', (req, res) => {
  Users.create(req.body)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });

});

// Retrieves a user by its _id and populated thought and reaction data
app.get('/user/:id', (req, res) => {
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
app.put('/user/:id', (req, res) => {
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
app.delete('/user/:id', (req, res) => {
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

// Creates a new thought
app.post('/thought/', (req, res) => {
  Thoughts.create(req.body)
    .then((thought) => {
      res.json(thought);
    })
    .catch((err) => {
      res.json(err);
    });
});

// reads a thought by id
app.get('/thought/:id', (req, res) => {
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
app.put('/thought/:id', (req, res) => {
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
app.delete('/thought/:id', (req, res) => {
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


// Creates a new reaction
app.post('/reaction/', (req, res) => {
  Reactions.create(req.body)
    .then((reaction) => {
      Thoughts.findOneAndUpdate(
        { _id: req.body.thoughtId },
        { $push: { reactions: reaction._id } },
        { new: true }
      )
        .then((thought) => {
          if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
          }
          res.json(reaction);
        })
        .catch((err) => {
          res.json(err);
        });
    })
});

// Deletes a reaction by its _id
app.delete('/reaction/:id', (req, res) => {
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
app.get('/users/', (req, res) => {
  Users.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Retrieves all thoughts
app.get('/thoughts/', (req, res) => {
  Thoughts.find({})
    .then((thoughts) => {
      res.json(thoughts);
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

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// create model
const UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  }

});

UserSchema.pre('save', function(next) {
  let user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {
  User
};

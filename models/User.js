const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    unique: true,
    type: String
  },
  password: String
})

const User = mongoose.model('User', userSchema);
module.exports = User;
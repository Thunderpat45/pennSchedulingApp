const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    privilegeLevel: {type: Boolean, default: false},
    lastVerified: String,
    color: String,   
});

module.exports = mongoose.model('User', userSchema);
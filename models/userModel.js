const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    storename:String,
    email: String,
    password: String,
    isActive: Boolean,
    role: String,
    collectionName:String,
    refreshToken: String,
    createdAt: Date,
    updatedAt: Date,
    otp: Number,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
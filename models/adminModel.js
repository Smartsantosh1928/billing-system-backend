const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    databaseName: String,
    isActive:Boolean,
});

const Admin=mongoose.model('Admin', adminSchema);

module.exports=Admin;
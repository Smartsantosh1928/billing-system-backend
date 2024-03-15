const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sequenceSchema = new Schema({
    name: String,
    value: { type: Number, default: 0 }
});

const Sequence = mongoose.model('Sequence', sequenceSchema);

module.exports = Sequence;
const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

const Sequence = mongoose.model('Sequence', sequenceSchema);

async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Sequence.findByIdAndUpdate(sequenceName, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
  return sequenceDocument.sequence_value;
}

module.exports = { Sequence, getNextSequenceValue };

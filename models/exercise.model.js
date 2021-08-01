const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: true }
);

const Exercise = mongoose.model('excercises', exerciseSchema);

module.exports = Exercise;

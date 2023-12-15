// models/Data.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema({
    income: {
        type: [Number], // Array of numbers
        required: true
    },
    saving: {
        type: [Number], // Array of numbers
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Data = mongoose.model('Data', DataSchema);
module.exports = Data;

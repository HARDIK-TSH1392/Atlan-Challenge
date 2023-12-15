const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    answers: {
        type: Schema.Types.ObjectId,
        ref: 'Answer'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;

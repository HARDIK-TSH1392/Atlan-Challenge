const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    answers: [
        Schema.Types.Mixe
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

const Answer = mongoose.model('Answer', AnswerSchema);
module.exports = Answer;

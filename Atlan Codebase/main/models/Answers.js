const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    answers: [
        Schema.Types.Mixed
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

const Answer = mongoose.model('Answers', AnswerSchema);
module.exports = Answer;

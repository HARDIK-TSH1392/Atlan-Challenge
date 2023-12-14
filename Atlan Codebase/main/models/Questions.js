const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    questions: [{
        type: String,
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;

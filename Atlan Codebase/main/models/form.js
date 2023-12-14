const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormSchema = new Schema({
    title: String,
    questions: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
    responses: [{
        type: Schema.Types.ObjectId,
        ref: 'Response'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const Form = mongoose.model('Form', FormSchema);
module.exports = Form;

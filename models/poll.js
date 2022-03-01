//Import dependencies
const mongoose = require('mongoose');
const Joi = require('joi');
const { date } = require('joi');
const { optionSchema } = require('./option');

//Define Poll schema
const pollSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 1, maxlength: 30},
    options: [{type: optionSchema, required: true, default: []}],

    totalVotes: {type: Number, required: true, default: 0},
    voters: [{type: mongoose.Types.ObjectId, ref: 'User'}],

    dateCreated: {type: Date, default: Date.now},
    active: {type: Boolean, default: true}
});

//Create model 
const Poll = mongoose.model('Poll', pollSchema);

//Joi validation
function validatePoll(poll) {
    const schema = Joi.object({
        title: Joi.string().min(1).max(30).required(),
    });
    return schema.validate(poll);
};


//Exports
exports.Poll = Poll;
exports.validatePoll = validatePoll;
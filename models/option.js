//Import dependencies
const mongoose = require('mongoose');
const Joi = require('joi');

//Define Option schema
const optionSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 1, maxlength: 30},
    votes: {type: Number, required: true, default: 0},
});

//Create model 
const Option = mongoose.model('Option', optionSchema);

//Joi validation
function validateOption(option) {
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(30).required(),
        lastName: Joi.string().min(1).max(30).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(6).max(1024).required(),
    });
    return schema.validate(option);
};

//Exports
exports.Option = Option;
exports.optionSchema = optionSchema;
exports.validateOption = validateOption;
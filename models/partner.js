//Import dependencies
const mongoose = require('mongoose');
const Joi = require('joi');

//Define Partner schema
const partnerSchema = new mongoose.Schema({
    firstName: {type: String, required: true, minlength: 1, maxlength: 30},
    lastName: {type: String, required: true, minlength: 1, maxlength: 30},

    username: {type: String, required: true, minlength: 1, maxlength: 30},
    image: {type: String, required: true, default: ''},
});

//Create model 
const Partner = mongoose.model('Partner', partnerSchema);

//Joi validation
function validatePartner(partner) {
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(30).required(),
        lastName: Joi.string().min(1).max(30).required(),
        username: Joi.string().min(1).max(30).required(),
    });
    return schema.validate(partner);
};

//Exports
exports.Partner = Partner;
exports.validatePartner = validatePartner;
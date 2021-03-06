//Import dependencies
const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

//Define User schema
const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, minlength: 1, maxlength: 20},
    lastName: {type: String, required: true, minlength: 1, maxlength: 20},

    email: {type: String, unique: true, required: true, minlength: 5, maxlength: 255},
    password: {type: String, required: true, minlength: 6, maxlength: 255},

    isAdmin: {type: Boolean, default: false},
});

//JWT assignment method
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ 
        _id: this._id, 
        firstName: this.firstName, 
        lastName: this.lastName, 
        isAdmin: this.isAdmin,
    },
    config.get('jwtSecret'));
};

//Create model 
const User = mongoose.model('User', userSchema);

//Joi validation
function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(30).required(),
        lastName: Joi.string().min(1).max(30).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(6).max(1024).required(),
    });
    return schema.validate(user);
};

//Exports
exports.User = User;
exports.validateUser = validateUser;
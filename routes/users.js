//Imports
const express = require('express'); 
const bcrypt = require('bcrypt'); 
const { User, validateUser } = require('../models/user');  
const auth = require('../middleware/auth');

//Define router
const router = express.Router();

//Endpoint Handlers
//POST Register New User - email, password, first name, last name
router.post('/register', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send(`User already Registered.`);

        const salt = await bcrypt.genSalt(10);
        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        });

        await user.save();

        const token = user.generateAuthToken();
        
        return res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send({_id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email });
    }
    catch (err) {
        return res.status(500).send(`Internal Server Error: ${err}`);
    }
});

//DELETE User - id, auth
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if(!user) return res.status(400).send(`The user with id: "${req.params.id}" does not exist.`);
        
        user = await user.remove();

        return res.send(user);
    }
    catch(err) {
        return res.status(500).send(`Internal Server Error: ${err}`);
    }
});

//Test Endpoints
//GET All Users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
       
        return res.send(users);
    } catch (err) {
        return res.status(500).send(`Internal Server Error: ${err}`);
    }
});

//Exports
module.exports = router;
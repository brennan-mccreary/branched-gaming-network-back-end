//Imports
const express = require('express'); 
const { Option } = require('../models/option'); 
const { Poll, validatePoll } = require('../models/poll');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//Define router
const router = express.Router();

//Endpoint Handlers
//POST New Poll - title, options[title], auth, admin
router.post('/create', [auth, admin], async (req, res) => {
    try {
        let poll = new Poll({
            title: req.body.title,
            options: [],
        });

        let options = req.body.options
        for(let i = 0; i < options.length; i++) {
            newOption = new Option({title: options[i]})
            await newOption.save();
            poll.options.push(newOption);
        }

        await poll.save();

        return res.send(poll);
    }
    catch(err) {
        return res.status(500).send(`Internal Server Error: ${err}`);
    }
});

//PUT Poll vote - poll id, option id, auth
router.put('/:id/vote/:poll/:option', auth, async (req, res) => {
    try {
        let options = await Poll.findById(req.params.poll);
        options = options.options;
        
        let index = options.findIndex((obj) => {
            return obj._id == req.params.option
        });
        
        let option = await Option.findByIdAndUpdate(req.params.option, { $inc: { votes: 1}}, {new: true});
        await option.save();

        

        let poll = await Poll.findByIdAndUpdate(req.params.poll, { $inc: { totalVotes: 1}}, {new: true});
        poll.voters.push(req.params.id);
        poll.options.splice(index, 1, option);
        await poll.save();
        
        return res.send(poll);
    }
    catch(err) {
        return res.status(500).send(`Internal Server Error: ${err}`);
    }
});

//DELETE Poll - id, auth, admin
router.delete('/remove/:id', [auth, admin], async (req, res) => {
    try {
        let poll = await Poll.findById(req.params.id);
        if(!poll) return res.status(400).send(`The poll with id: "${req.params.id}" does not exist.`);
    
        poll = await poll.remove();

        return res.send(poll);
    }
    catch(err) {
        return res.status(500).send(`Internal Server Error: ${err}`);
    }
});

//Test Endpoints
//GET All Users
router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find();
       
        return res.send(polls);
    } catch (err) {
        return res.status(500).send(`Internal Server Error: ${err}`);
    }
});

//Data functions



//Exports
module.exports = router;
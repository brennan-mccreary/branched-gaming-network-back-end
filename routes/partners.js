//Imports
const express = require('express'); 
const { Partner, validatePartner } = require('../models/partner');  
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { userInfo } = require('os');
const fileUpload = require('../middleware/file-upload');

//Define router
const router = express.Router();

//Endpoint Handlers
//POST New Partner - first name, last name, username, image, auth, admin
router.post('/create', [auth, admin, fileUpload.single('image')], async (req, res) => {
    try {
        const { error } = validatePartner(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let partner = await Partner.findOne({ username: req.body.username });
        if (partner) return res.status(400).send(`Partner already exists.`);

        partner = new Partner({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            image: req.file.path,
            user_id: req.body.user_id
        });

        await partner.save();

        return res.send(partner);
    }
    catch(err) {
        return res.status(500).send(`Internal Server Error: ${err}`);
    }
});

//DELETE Partner - id, auth, admin
router.delete('/remove/:id', [auth, admin], async (req, res) => {
    try {
        let partner = await Partner.findById(req.params.id);
        if(!partner) return res.status(400).send(`The partner with id: "${req.params.id}" does not exist.`);
    
        partner = await partner.remove();

        const partners = await Partner.find();

        return res.send(partners);
    }
    catch(err) {
        return res.status(500).send(`Internal Server Error: ${err}`);
    }
});

//Test Endpoints
//GET All Partners
router.get('/', async (req, res) => {
    try {
        const partners = await Partner.find();
       
        return res.send(partners);
    } catch (err) {
        return res.status(500).send(`Internal Server Error: ${err}`);
    }
});

//Exports
module.exports = router;
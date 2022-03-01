//Imports
const connectDB = require('./startup/db');
const cors = require('cors');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

//Route Imports
const users = require('./routes/users');
const auth = require('./routes/auth');

//Run database connection 
connectDB();

//Run App initialization middleware
app.use(cors());
app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);

//Image collection middleware
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

//Listener
const port = process.env.PORT || 5003;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
});
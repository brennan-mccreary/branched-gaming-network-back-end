//Imports
const connectDB = require('./startup/db');
const cors = require('cors');
const express = require('express');
const app = express();

//Route Imports
const auth = require('./routes/auth');

//Run database connection 
connectDB();

//Run App initialization middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', auth);

//Listener
const port = process.env.PORT || 5003;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
});
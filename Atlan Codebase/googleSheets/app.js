const express = require('express');
const cors = require('cors');
const getData = require('./routes/getData');

const app = express();
const PORT = process.env.PORT || 5000; // Use a different port for the new server

app.use(cors());
app.use(express.json());

// Routes
app.use('/getData', getData);

app.listen(port, () => {
    console.log(`Server is running on port: ${PORT}`);
});

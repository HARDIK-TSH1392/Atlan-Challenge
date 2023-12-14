const express = require('express');
const axios = require('axios');
const { sequelize } = require('./models'); // Ensure the path to your models is correct
const cors = require('cors');
const validationRoutes = require('./routes/validate');

const app = express();
const PORT = process.env.PORT || 6000; // Use a different port for the validation server

app.use(cors());
app.use(express.json());

// Routes
app.use('/validate', validationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${PORT}`);
});

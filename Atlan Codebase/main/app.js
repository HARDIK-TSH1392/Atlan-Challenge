const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models'); // Ensure the path to your models is correct
const formRoutes = require('./routes/forms');
const responseRoutes = require('./routes/responses');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


// Routes
app.use('/forms', formRoutes);
app.use('/responses', responseRoutes);

// Database Connection
sequelize
  .sync()
  .then(() => {
    console.log('Database connection established.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

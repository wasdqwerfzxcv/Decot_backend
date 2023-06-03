const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const { sequelize } = require('./models/User'); // Assuming you have Sequelize configured for SQL database
const authRoutes = require('./router/authRouter');

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  optionsSuccessStatus: 200 
}


app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/auth',authRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
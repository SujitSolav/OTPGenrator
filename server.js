const express = require('express');
const bodyParser = require('body-parser');
const otpRouter=require('./Routes/otpRoutes')
const dbConfig=require('./dbCofig/dbConfig')
require('dotenv').config();

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use('/api/otp',otpRouter);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
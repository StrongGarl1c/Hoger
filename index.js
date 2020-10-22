const express = require('express');

const uri = process.env.API_URI;
const app = express();
const port = process.env.PORT || 27017;

app.listen(port);
app.use(express.static('public'));
app.use(express.json());

// route paths
const top15 = require('./routes/top15');
const submitResult = require('./routes/submitResult');

// routes
app.use('/', top15);
app.use('/submitResult', submitResult);

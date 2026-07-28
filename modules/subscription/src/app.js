const express = require('express');
const cors = require('cors');
const subscriptionRoute = require('./route/subscription.route');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', subscriptionRoute);

module.exports = app;

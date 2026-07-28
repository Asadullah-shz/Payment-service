const express = require('express');
const cors = require('cors');
const payoutRoute = require('./route/payout.route');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', payoutRoute);

module.exports = app;

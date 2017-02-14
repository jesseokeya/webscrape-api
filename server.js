'use strict';
const port = process.env.PORT || 5000;
const express = require('express');
const colors = require('colors');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const path = require('path');
const router = require('./minroutes/links.js');
const tags = require('./minroutes/tags.js');
const app = express();

app.use(favicon(path.join(__dirname , './logo/favicon.ico')));
app.use(morgan('dev'));
app.get('/', (req, res) => {
  res.send('welcome to the webscrape-api 🙏🏽');
});
app.use('/api', router);
app.use('/api', tags);


app.listen(port, () => {
  console.log('webscrape-api running on port %s'.bgGreen, port);
});

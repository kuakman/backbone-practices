/**
 *	Main Run
 **/
const express = require('express');

const app = express();

app.use('/', express.static('./src')).listen(3000);

const express           = require('express');
const config            = require('./js/config');

const app = express();

config(app, __dirname);
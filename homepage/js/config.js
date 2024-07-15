const path = require('path');
const express = require('express');
const session           = require('express-session');
const MemoryStore       = require('memorystore')(session);

let config = (app, __dirname) => {
    app.use(express.json()); // json data process
    app.use(express.urlencoded({extended: true})); // POST data process, for use POST

    app.use(session(session_obj)); // use session

    app.use(express.static(path.join(__dirname, 'html'))); //using folders for static
    app.use('/register', express.static(path.join(__dirname, 'register')));
    app.use('/login', express.static(path.join(__dirname, 'login')));
    app.use('/pict', express.static(path.join(__dirname, 'pict')));
    app.use('/js', express.static(path.join(__dirname, 'js')));
    app.use('/find', express.static(path.join(__dirname, 'find')));
    app.use('/search', express.static(path.join(__dirname, 'search')));
    app.use('/test', express.static(path.join(__dirname, 'test')));
    app.use('/json', express.static(path.join(__dirname, 'json')));
}

const max_time = 1000 * 60 * 60 * 1; // ms * s * m * h

const session_obj = {
    secret: "!$23pnubuddy23!$",
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({ checkPeriod: max_time }),
    cookie: { maxAge: max_time }
}

module.exports = {config};
const path = require('path');
const express = require('express');
const session           = require('express-session');
const MemoryStore       = require('memorystore')(session);

let config = (app, __dirname) => {
    const clear_index = {index: ""}; // when connnect site, block the link of index.html and use the function first.
    const arr_folder = ['home', 'register', 'login', 'pict', 'js', 'findIDPW', 'search', 'test', 'json', 'board', 'bar', 'chat'];
    app.use(express.json()); // json data process
    app.use(express.urlencoded({extended: true})); // POST data process, for use POST

    app.use(session(session_obj)); // use session

    // using folders for static ====================================
    for(i of arr_folder) {
        if(i == 'home') {
            app.use('/', express.static(path.join(__dirname, i), clear_index));
        }
        else {
            app.use('/' + i, express.static(path.join(__dirname, i), clear_index));
        }
    }
}

const max_time = 1000 * 60 * 60 * 1; // ms * s * m * h

const session_obj = {
    secret: "!$23pnubuddy23!$",
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({ checkPeriod: max_time }),
    cookie: { maxAge: max_time }
}

module.exports = config;
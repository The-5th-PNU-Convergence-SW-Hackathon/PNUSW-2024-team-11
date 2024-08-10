const path = require('path');
const express = require('express');
const session           = require('express-session');
const MemoryStore       = require('memorystore')(session);
const FileStore         = require('session-file-store')(session);
const MysqlStore        = require('express-mysql-session')(session);
const mysql_session     = require('../config/session');
const cors              = require("cors");
const http              = require('http');
const config_socket     = require('./config_socket');
const default_route     = require('../router/index');

// const max_time = 1000 * 60 * 60 * 1; // ms * s * m * h

const session_obj = {
    secret: "!$23pnubuddy23!$",
    resave: false,
    saveUninitialized: false,
    // store: new MemoryStore({ checkPeriod: max_time }),
    // store: new FileStore({logFn: function(){}}),
    store: new MysqlStore(mysql_session),
    cookie: {
        maxAge: mysql_session.expiration/* ,
        secure: true,
        httpOnly: true */
     }
}

const config = (app, __dirname) => {
    // configuration ==========================
    app.set('port', process.env.PORT || 3000); // site is open the n port
    app.use(session(session_obj)); // use session

    const clear_index = {index: ""}; // when connnect site, block the link of index.html and use the function first.
    const arr_folder = ['home', 'register', 'login', 'pict', /* 'js',  */'findIDPW', 'search', 'test', 'json', 'board', 'bar', 'chat', 'bootstrap-5.3.3-dist', 'uploads', 'pwa', 'rmt_checklist'];
    app.use(express.json()); // json data process
    app.use(express.urlencoded({extended: true})); // POST data process, for use POST
    app.use(cors());

    // if you want attach the code, attach under this line. ==================
    
    

    // if you want attach the code, attach over this line. ===================

    // using folders for static ====================================
    for(i of arr_folder) {
        if(i == 'home') {
            app.use('/', express.static(path.join(__dirname, i), clear_index));
        }
        else if(i == 'rmt_checklist') {
            app.use('/checklist', express.static(path.join(__dirname, i), clear_index));
        }
        else {
            app.use('/' + i, express.static(path.join(__dirname, i), clear_index));
        }
    }

    // const httpServer = http.createServer(app);
    // config_socket.config(httpServer);
    app.use('/', default_route);
    // httpServer.listen(app.get('port'), () => console.log('Express server listening on port ' + app.get('port')));
    const server = app.listen(app.get('port'), () => console.log('Express server listening on port ' + app.get('port')));
    config_socket.config(server);
}

module.exports = config;
const express = require("express");
const router = express.Router();
const register_route    = require('./register.js');
const login_route       = require('./login.js');
const ajax_route        = require('./ajax.js');

router.use('/register', register_route); // routers
router.use('/login', login_route);
router.use('/ajax', ajax_route);

// route single page
router.get('/', (req, res) => res.sendFile('index.html', {root: './html'}));
router.get('/find', (req, res) => res.sendFile('index.html', {root: './find'}));
router.get('/search', (req, res) => res.sendFile('index.html', {root: './search'}));
router.get('/test', (req, res) => res.sendFile('test.html', {root: './test'}));
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        }
        else res.redirect('/');
    })
});
router.get('/error', (req, res) => res.send("error"));

module.exports = router;
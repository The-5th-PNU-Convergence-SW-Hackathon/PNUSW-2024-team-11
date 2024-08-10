const express = require("express");
const router = express.Router();
const config = require('./config');

config(router); // another router setting

// route single page
router.get('/', (req, res) => res.sendFile('home.html', {root: './home'}));
router.get('/findIDPW', (req, res) => res.sendFile('index.html', {root: './findIDPW'}));
router.get('/search', (req, res) => res.sendFile('index.html', {root: './search'}));
router.get('/error', (req, res) => res.send("error"));
router.get('/bar', (req, res) => res.sendFile('index.html', {root: './bar'}));
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        }
        else res.redirect('/');
    })
});

router.all('*', (req, res) => res.status(404).send('<h1>404 Not found</h1>')); // error handler

module.exports = router;
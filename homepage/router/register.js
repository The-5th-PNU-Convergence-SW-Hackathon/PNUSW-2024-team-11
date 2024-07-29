const express = require("express");
const router = express.Router();
const register_chk = require('../js/register_chk.js');
const verify_email = require('../js/verify.js');

router.get('/', (req, res) => res.sendFile('index.html', {root: './register'}));
router.get('/status', (req, res) => res.sendFile('status.html', {root: './register'}));
router.get('/verify', (req, res) => {
    verify_email.verify(req);
    res.json();
});

router.post('/chk', (req, res) => register_chk.register(req, res));

module.exports = router;
const express = require("express");
const router = express.Router();
const register_chk = require('../js/register_chk.js');

router.get('/', (req, res) => res.sendFile('index.html', {root: './register'}));
router.get('/status', (req, res) => res.sendFile('status.html', {root: './register'}));

router.post('/chk', (req, res) => register_chk.register(req, res));

module.exports = router;
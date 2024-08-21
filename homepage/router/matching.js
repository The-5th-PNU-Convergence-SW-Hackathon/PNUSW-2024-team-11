const express = require("express");
const router = express.Router();
const sql = require('../js/sql_func.js');

router.get('/', (req, res) => req.session.login_status ?
res.sendFile('index.html', {root: './rmt_matching'}) : res.redirect('/login'));

router.get('/get_roommate', (req, res) => sql.get_roommate(req, res));

module.exports = router;
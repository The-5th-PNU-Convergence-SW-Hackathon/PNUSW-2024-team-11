const express = require("express");
const router = express.Router();
const sql = require('../js/sql_func.js');

router.get('/', (req, res) => req.session.login_status ? 
        res.redirect('/') : res.sendFile('index.html', {root: './login'}));
router.post('/chk', (req, res) => sql.login(req, res));

module.exports = router;
const express = require("express");
const router = express.Router();
const sql = require('../js/sql_func.js');

router.get('/', (req, res) => req.session.login_status ?
res.sendFile('index.html', {root: './rmt_checklist'}) : res.redirect('/login'));

router.post('/post_checklist', (req, res) => sql.post_checklist(req, res));
router.get('/get_checklist', (req, res) => sql.get_checklist(req, res));


module.exports = router;

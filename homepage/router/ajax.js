const express = require("express");
const router = express.Router();
const sql = require("../js/sql_func.js");
const session_route = require('./session.js');

router.use('/session', session_route);

router.get('/', (req, res) => res.json({"ret":"ajax page"}));
router.post('/check_id', (req, res) => sql.check_id(req, res));
router.post('/check_nickname', (req, res) => sql.check_nickname(req, res));

module.exports = router;
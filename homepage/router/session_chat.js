const express = require("express");
const router = express.Router();
const sql = require('../js/sql/chat');

router.post('/away_nickname',(req, res) => res.json({nickname: req.session.chat.away_nickname}));

module.exports = router;
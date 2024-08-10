const express = require("express");
const router = express.Router();

router.get('/', (req, res) => req.session.login_status ?
res.sendFile('matching.html', {root: './rmt_matching'}) : res.redirect('/matching'));

module.exports = router;
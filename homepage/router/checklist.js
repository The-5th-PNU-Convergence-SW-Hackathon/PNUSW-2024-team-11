const express = require("express");
const router = express.Router();

router.get('/', (req, res) => req.session.login_status ?
res.sendFile('index.html', {root: './rmt_checklist'}) : res.redirect('/login'));

module.exports = router;
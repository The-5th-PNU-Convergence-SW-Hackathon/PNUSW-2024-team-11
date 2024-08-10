const express = require("express");
const router = express.Router();

router.get('/', (req, res) => req.session.login_status ?
res.sendFile('profile.html', {root: './home/profile'}) : res.redirect('/login'));

module.exports = router;
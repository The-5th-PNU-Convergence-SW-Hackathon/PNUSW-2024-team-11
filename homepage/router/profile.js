const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    if(req.session.login_status) {
        res.sendFile('profile.html', {root: './home/profile'});
    }
    else {
        res.redirect('/login');
    }
});

module.exports = router;
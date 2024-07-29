const express = require("express");
const router = express.Router();
const verify = require('../js/sql/verify');

const check_word = /[^a-z0-9]/;

router.get('/', async (req, res) => {
    // console.log(req.query);
    if(check_word.test(req.query.email) || check_word.test(req.query.token)) {
        res.redirect('/error');
    }
    const chk = await verify.check_verify(req.query.email, req.query.token);
    console.log(chk);
    if(chk == 1) {
        req.session.verify_email_status = true;
    }
    else {
        req.session.verify_email_status = false;
    }
    res.redirect('/verify_email/status');
});
router.get('/status', (req, res) => res.sendFile('index.html', {root: './register/verify_email'}));
router.get('/index.js', (req, res) => res.sendFile('index.js', {root: './register/verify_email'}));

module.exports = router;
const express = require("express");
const router = express.Router();
const sql = require('../js/sql_func.js');

router.get('/', (req, res) => {
    if(req.session.login_status) {
        res.redirect('/');
    }
    else {
        res.sendFile('index.html', {root: './login'});
    }
});
router.get('/status', (req, res) => {
    // console.log(req.session);
    if(req.session.login_status) {
        res.redirect("/");
    }
    else {
        res.redirect("back");
    }
});

router.post('/chk', (req, res) => sql.login(req, res));

module.exports = router;
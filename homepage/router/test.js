const express = require("express");
const router = express.Router();
const crypto = require('../js/crypto');
const verify = require('../js/verify');

router.get('/', (req, res) => res.sendFile('index.html', {root: './test'}));
router.get('/verify_email', async (req, res) => {
    const email = "scientistkjm@naver.com";
    const iv = crypto.create_iv();
    console.log("iv : ", iv);
    req.session.verify_info = [email, await crypto.create_crypto("test"), await crypto.create_aes(email, iv)];
    verify.verify(req);
    res.send("email send");
});

module.exports = router;
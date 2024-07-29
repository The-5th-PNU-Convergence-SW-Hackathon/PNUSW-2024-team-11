const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    // console.log(req.session);
    res.send(req.session);
});

router.post('/login_status', (req, res) => res.json({login_status: req.session.login_status}));
router.post('/USER', (req, res) => res.json({USER: req.session.USER}));
router.post('/register_status', (req, res) => res.json({register_status: req.session.register_status}));
router.post('/send_verify', (req, res) => res.json({send_verify: req.session.send_verify}));
router.post('/verify_email_status', (req, res) => res.json({verify_email_status: req.session.verify_email_status}));

module.exports = router;
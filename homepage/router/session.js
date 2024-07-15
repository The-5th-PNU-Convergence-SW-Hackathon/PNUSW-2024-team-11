const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    // console.log(req.session);
    res.send(req.session);
});

router.post('/login_status', (req, res) => res.json({login_status: req.session.login_status}));
router.post('/login_info', (req, res) => res.json({login_info: req.session.login_info}));
router.post('/register_status', (req, res) => res.json({register_status: req.session.register_status}));

module.exports = router;
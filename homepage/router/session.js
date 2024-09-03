const express = require("express");
const router = express.Router();
const crypto = require('../js/crypto');
const chat_router = require('./session_chat');

router.use('/chat', chat_router);

router.get('/', (req, res) => res.send(req.session));

router.post('/login_status', (req, res) => res.json({login_status: req.session.login_status}));
// router.post('/USER', (req, res) => res.json({USER: req.session.USER}));
router.post('/register_status', (req, res) => res.json({register_status: req.session.register_status}));
router.post('/send_verify', (req, res) => res.json({send_verify: req.session.send_verify}));
router.post('/verify_email_status', (req, res) => res.json({verify_email_status: req.session.verify_email_status}));
router.post('/profile', async (req, res) => res.json([await crypto.decrypt_aes(req.session.USER[1], await crypto.convert_buffer(req.session.iv)),
                                                      await crypto.decrypt_aes(req.session.USER[2], await crypto.convert_buffer(req.session.iv)),
                                                      await crypto.decrypt_aes(req.session.USER[3], await crypto.convert_buffer(req.session.iv))
                                                    ]));


module.exports = router;
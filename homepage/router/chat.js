const express = require("express");
const router = express.Router();
const sql = require('../js/sql/chat');

router.get('/', (req, res) => req.session.login_status !== undefined || req.session.login_status == 1 ?
    res.sendFile('index.html', {root: './chat'}) : res.send('<script>alert("먼저 로그인 해주세요."); location.href = "/login"</script>'));
router.get('/room', (req, res) => sql.check_room(req, res));
router.post('/send', (req, res) => sql.send_chat(req, res));

module.exports = router;
const express = require("express");
const router = express.Router();

router.get('/', (req, res) => req.session.login_status ?
res.sendFile('index.html', {root: './map'}) : res.redirect('/login'));

router.get('/map/lottery', (req, res) => {
    if (req.session && req.session.USER) {
        // 사용자가 로그인한 경우 상세 페이지를 제공
        res.sendFile('lottery.html', { root: './map' });
    } else {
        // 사용자가 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        res.redirect('/login');
    }
});

module.exports = router;
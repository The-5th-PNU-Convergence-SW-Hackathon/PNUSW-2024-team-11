const express = require("express");
const router = express.Router();

router.get('/', (req, res) => req.session.login_status ?
res.sendFile('index.html', {root: './map'}) : res.redirect('/login'));

router.get('/map/lottery', (req, res) => {
    if (req.session && req.session.USER) {
        // ����ڰ� �α����� ��� �� �������� ����
        res.sendFile('lottery.html', { root: './map' });
    } else {
        // ����ڰ� �α������� ���� ��� �α��� �������� �����̷�Ʈ
        res.redirect('/login');
    }
});

module.exports = router;
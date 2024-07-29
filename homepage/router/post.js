const express = require("express");
const router = express.Router();
const sql = require('../js/sql_func.js');
const bodyParser = require('body-parser');
router.get('/', (req, res) => res.sendFile('post.html', {root: './board'}));
// post로 /insert 요청을 보내면 sql에 저장된 fuc인 post_insert함수를 실행.
router.post('/insert', (req, res) => sql.post_insert(req, res));
router.get('/status', (req, res) => {
    if(req.session.post_status) {
        res.send("success");
    }
    else if(!req.session.post_status) {
        res.send("fail");
    }
    else {
        res.send("none");
    }
});

//라우터 객체를 모듈로 내보내 다른 파일에서 사용할 수 있게 함.
module.exports = router;